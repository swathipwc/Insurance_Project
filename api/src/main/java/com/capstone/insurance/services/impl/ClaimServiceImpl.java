package com.capstone.insurance.services.impl;

import com.capstone.insurance.dto.claim.ClaimCreateRequest;
import com.capstone.insurance.dto.claim.ClaimDto;
import com.capstone.insurance.dto.claim.ClaimStatusUpdateRequest;
import com.capstone.insurance.entities.*;
import com.capstone.insurance.entities.enums.ClaimStatus;
import com.capstone.insurance.exceptions.BadRequestException;
import com.capstone.insurance.exceptions.ResourceNotFoundException;
import com.capstone.insurance.repositories.*;
import com.capstone.insurance.services.ActivityLogService;
import com.capstone.insurance.services.ClaimService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClaimServiceImpl implements ClaimService {

    private final ClaimRepository claimRepository;
    private final CustomerRepository customerRepository;
    private final PolicyRepository policyRepository;
    private final CustomerPolicyRepository customerPolicyRepository;
    private final ActivityLogService activityLogService;

    @Override
    public ClaimDto createClaim(Long userId, ClaimCreateRequest request) {
        Customer customer = customerRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("Customer profile not found for user"));

        Policy policy = policyRepository.findById(request.getPolicyId())
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found with id " + request.getPolicyId()));

        if (!customerPolicyRepository.existsByCustomerIdAndPolicyId(customer.getId(), policy.getId())) {
            throw new BadRequestException("Policy is not assigned to this customer");
        }

        LocalDateTime now = LocalDateTime.now();
        Claim claim = Claim.builder()
                .customer(customer)
                .policy(policy)
                .claimDate(request.getClaimDate() != null ? request.getClaimDate() : LocalDate.now())
                .claimAmount(request.getClaimAmount())
                .description(request.getDescription())
                .evidenceUrl(request.getEvidenceUrl())
                .status(ClaimStatus.SUBMITTED)
                .createdAt(now)
                .updatedAt(now)
                .build();
        claimRepository.save(claim);

        // Generate claim number for activity log
        String claimNumber = generateClaimNumber(claim.getId(), claim.getCreatedAt());
        
        // Log activity: Claim submitted
        activityLogService.logAction(userId, 
                "CLAIM_SUBMITTED", 
                String.format("Claim %s submitted for policy %s. Amount: $%.2f", 
                        claimNumber, 
                        policy.getPolicyCode(), 
                        request.getClaimAmount()));

        return toDto(claim);
    }

    @Override
    public List<ClaimDto> getMyClaims(Long userId) {
        Customer customer = customerRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("Customer profile not found for user"));

        return claimRepository.findByCustomerId(customer.getId())
                .stream()
                .sorted(Comparator.comparing(Claim::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ClaimDto> getAllClaims(String status, LocalDate from, LocalDate to) {
        List<Claim> claims;
        LocalDateTime fromDt = from != null ? from.atStartOfDay() : null;
        LocalDateTime toDt = to != null ? to.atTime(23, 59, 59) : null;

        if (status != null && !status.isBlank()) {
            ClaimStatus st;
            try {
                st = ClaimStatus.valueOf(status);
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid claim status: " + status);
            }

            if (fromDt != null && toDt != null) {
                claims = claimRepository.findByStatusAndCreatedAtBetween(st, fromDt, toDt);
            } else {
                claims = claimRepository.findByStatus(st);
            }
        } else {
            if (fromDt != null && toDt != null) {
                claims = claimRepository.findByCreatedAtBetween(fromDt, toDt);
            } else {
                claims = claimRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
            }
        }

        // Sort by createdAt descending (newest first) if not already sorted
        if (fromDt != null || status != null) {
            claims.sort(Comparator.comparing(Claim::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())));
        }

        return claims.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public ClaimDto updateClaimStatus(Long claimId, ClaimStatusUpdateRequest request, Long userId) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found with id " + claimId));

        ClaimStatus oldStatus = claim.getStatus();
        claim.setStatus(request.getStatus());
        claim.setRemarks(request.getRemarks());
        claimRepository.save(claim);

        // Generate claim number for activity log
        String claimNumber = generateClaimNumber(claim.getId(), claim.getCreatedAt());
        
        // Get status display name
        String statusDisplayName = request.getStatus().getDisplayName();
        
        // Log activity: Claim status updated
        String details = String.format("Claim %s status changed from %s to %s", 
                claimNumber, 
                oldStatus.getDisplayName(), 
                statusDisplayName);
        if (request.getRemarks() != null && !request.getRemarks().trim().isEmpty()) {
            details += ". Remarks: " + request.getRemarks();
        }
        
        activityLogService.logAction(userId, "CLAIM_STATUS_UPDATED", details);

        return toDto(claim);
    }

    private ClaimDto toDto(Claim c) {
        // Generate claim number (e.g., CLM-2025-001)
        String claimNumber = generateClaimNumber(c.getId(), c.getCreatedAt());
        
        // Get policy number from CustomerPolicy
        String policyNumber = customerPolicyRepository
                .findByCustomerIdAndPolicyId(c.getCustomer().getId(), c.getPolicy().getId())
                .map(CustomerPolicy::getPolicyNumber)
                .orElse("N/A");
        
        return ClaimDto.builder()
                .id(c.getId())
                .claimNumber(claimNumber)
                .customerId(c.getCustomer().getId())
                .policyId(c.getPolicy().getId())
                .policyNumber(policyNumber)
                .claimDate(c.getClaimDate())
                .claimAmount(c.getClaimAmount())
                .status(c.getStatus())
                .description(c.getDescription())
                .remarks(c.getRemarks())
                .evidenceUrl(c.getEvidenceUrl())
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .build();
    }
    
    private String generateClaimNumber(Long claimId, LocalDateTime createdAt) {
        int year = createdAt != null ? createdAt.getYear() : java.time.LocalDateTime.now().getYear();
        return String.format("CLM-%d-%03d", year, claimId);
    }
}
