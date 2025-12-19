package com.capstone.insurance.services.impl;

import com.capstone.insurance.dto.policy.AssignPolicyRequest;
import com.capstone.insurance.dto.policy.CustomerPolicyDto;
import com.capstone.insurance.dto.policy.PolicyCreateRequest;
import com.capstone.insurance.dto.policy.PolicyDto;
import com.capstone.insurance.dto.policy.PolicyUpdateRequest;
import com.capstone.insurance.entities.Customer;
import com.capstone.insurance.entities.CustomerPolicy;
import com.capstone.insurance.entities.Policy;
import com.capstone.insurance.exceptions.BadRequestException;
import com.capstone.insurance.exceptions.ResourceNotFoundException;
import com.capstone.insurance.repositories.CustomerPolicyRepository;
import com.capstone.insurance.repositories.CustomerRepository;
import com.capstone.insurance.repositories.PolicyRepository;
import com.capstone.insurance.services.PolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PolicyServiceImpl implements PolicyService {

    private final PolicyRepository policyRepository;
    private final CustomerRepository customerRepository;
    private final CustomerPolicyRepository customerPolicyRepository;

    @Override
    public PolicyDto createPolicy(PolicyCreateRequest request) {
        // Auto-generate policy code
        String policyCode = generatePolicyCode();

        LocalDateTime now = LocalDateTime.now();
        Policy policy = Policy.builder()
                .policyCode(policyCode)
                .policyType(request.getPolicyType())
                .coverageAmount(request.getCoverageAmount())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .createdAt(now)
                .updatedAt(now)
                .build();
        policyRepository.save(policy);

        return toDto(policy);
    }

    private String generatePolicyCode() {
        Policy lastPolicy = policyRepository.findTopByOrderByPolicyCodeDesc()
                .orElse(null);

        if (lastPolicy == null || lastPolicy.getPolicyCode() == null) {
            return "POL0001";
        }

        String lastCode = lastPolicy.getPolicyCode();
        if (lastCode.startsWith("POL")) {
            try {
                int number = Integer.parseInt(lastCode.substring(3));
                return String.format("POL%04d", number + 1);
            } catch (NumberFormatException e) {
                return "POL0001";
            }
        }
        return "POL0001";
    }

    @Override
    public List<PolicyDto> getAllPolicies() {
        return policyRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public PolicyDto getPolicyById(UUID id) {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found with id " + id));
        return toDto(policy);
    }

    @Override
    public PolicyDto updatePolicy(UUID id, PolicyUpdateRequest request) {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found with id " + id));

        policy.setPolicyType(request.getPolicyType());
        policy.setCoverageAmount(request.getCoverageAmount());
        policy.setStartDate(request.getStartDate());
        policy.setEndDate(request.getEndDate());
        policy.setStatus(request.getStatus());

        policyRepository.save(policy);
        return toDto(policy);
    }

    @Override
    public void assignPolicyToCustomer(UUID customerId, AssignPolicyRequest request) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id " + customerId));

        Policy policy = policyRepository.findById(request.getPolicyId())
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found with id " + request.getPolicyId()));

        if (customerPolicyRepository.existsByCustomerIdAndPolicyId(customer.getId(), policy.getId())) {
            throw new BadRequestException("Policy already assigned to this customer");
        }

        // Generate random policy number (mix of numbers and characters)
        String policyNumber = generateRandomPolicyNumber();

        LocalDateTime now = LocalDateTime.now();
        CustomerPolicy cp = CustomerPolicy.builder()
                .customer(customer)
                .policy(policy)
                .policyNumber(policyNumber)
                .createdAt(now)
                .updatedAt(now)
                .build();
        customerPolicyRepository.save(cp);
    }

    private String generateRandomPolicyNumber() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder();
        
        // Generate 10-character alphanumeric string
        for (int i = 0; i < 10; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        
        return sb.toString();
    }

    @Override
    public List<CustomerPolicyDto> getCustomerPolicies(Long userId) {
        Customer customer = customerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found for user id " + userId));

        List<CustomerPolicy> customerPolicies = customerPolicyRepository.findByCustomerId(customer.getId());
        
        // Sort by createdAt descending (newest first)
        customerPolicies.sort((a, b) -> {
            if (a.getCreatedAt() == null && b.getCreatedAt() == null) return 0;
            if (a.getCreatedAt() == null) return 1;
            if (b.getCreatedAt() == null) return -1;
            return b.getCreatedAt().compareTo(a.getCreatedAt());
        });

        return customerPolicies.stream()
                .map(cp -> {
                    Policy policy = cp.getPolicy();
                    return CustomerPolicyDto.builder()
                            .policyId(policy.getId())
                            .policyCode(policy.getPolicyCode())
                            .policyNumber(cp.getPolicyNumber())
                            .policyType(policy.getPolicyType())
                            .coverageAmount(policy.getCoverageAmount())
                            .startDate(policy.getStartDate())
                            .endDate(policy.getEndDate())
                            .status(policy.getStatus())
                            .createdAt(cp.getCreatedAt())
                            .updatedAt(cp.getUpdatedAt())
                            .build();
                })
                .collect(Collectors.toList());
    }

    private PolicyDto toDto(Policy p) {
        return PolicyDto.builder()
                .id(p.getId())
                .policyCode(p.getPolicyCode())
                .policyType(p.getPolicyType())
                .coverageAmount(p.getCoverageAmount())
                .startDate(p.getStartDate())
                .endDate(p.getEndDate())
                .status(p.getStatus())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}
