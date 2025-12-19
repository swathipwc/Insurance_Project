package com.capstone.insurance.services.impl;

import com.capstone.insurance.dto.dashboard.AdminDashboardStatsDto;
import com.capstone.insurance.dto.dashboard.CustomerDashboardStatsDto;
import com.capstone.insurance.dto.dashboard.MonthlyClaimData;
import com.capstone.insurance.dto.dashboard.PolicyTypeDistribution;
import com.capstone.insurance.entities.Claim;
import com.capstone.insurance.entities.Customer;
import com.capstone.insurance.entities.CustomerPolicy;
import com.capstone.insurance.entities.Policy;
import com.capstone.insurance.entities.enums.ClaimStatus;
import com.capstone.insurance.entities.enums.PolicyStatus;
import com.capstone.insurance.entities.enums.PolicyType;
import com.capstone.insurance.exceptions.ResourceNotFoundException;
import com.capstone.insurance.repositories.ClaimRepository;
import com.capstone.insurance.repositories.CustomerPolicyRepository;
import com.capstone.insurance.repositories.CustomerRepository;
import com.capstone.insurance.repositories.PolicyRepository;
import com.capstone.insurance.services.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final CustomerRepository customerRepository;
    private final PolicyRepository policyRepository;
    private final ClaimRepository claimRepository;
    private final CustomerPolicyRepository customerPolicyRepository;

    @Override
    public AdminDashboardStatsDto getAdminDashboardStats() {
        // Get basic counts
        long totalCustomers = customerRepository.count();
        long totalPolicies = policyRepository.count();
        long totalClaims = claimRepository.count();

        // Get all claims for calculations
        List<Claim> allClaims = claimRepository.findAll();
        
        long pendingClaims = allClaims.stream()
                .filter(c -> c.getStatus() == ClaimStatus.SUBMITTED || c.getStatus() == ClaimStatus.IN_REVIEW)
                .count();
        
        long approvedClaims = allClaims.stream()
                .filter(c -> c.getStatus() == ClaimStatus.APPROVED)
                .count();
        
        long rejectedClaims = allClaims.stream()
                .filter(c -> c.getStatus() == ClaimStatus.REJECTED)
                .count();

        // Calculate amounts
        double totalCoverageAmount = policyRepository.findAll().stream()
                .mapToDouble(p -> p.getCoverageAmount() != null ? p.getCoverageAmount() : 0.0)
                .sum();

        double totalClaimAmount = allClaims.stream()
                .mapToDouble(c -> c.getClaimAmount() != null ? c.getClaimAmount() : 0.0)
                .sum();

        double totalApprovedAmount = allClaims.stream()
                .filter(c -> c.getStatus() == ClaimStatus.APPROVED)
                .mapToDouble(c -> c.getClaimAmount() != null ? c.getClaimAmount() : 0.0)
                .sum();

        // Get monthly claims data (last 6 months)
        List<MonthlyClaimData> monthlyClaimsData = getMonthlyClaimsData();

        // Get policy type distribution
        List<PolicyTypeDistribution> policyTypeDistribution = getPolicyTypeDistribution();

        return AdminDashboardStatsDto.builder()
                .totalCustomers(totalCustomers)
                .totalPolicies(totalPolicies)
                .totalClaims(totalClaims)
                .pendingClaims(pendingClaims)
                .approvedClaims(approvedClaims)
                .rejectedClaims(rejectedClaims)
                .totalCoverageAmount(totalCoverageAmount)
                .totalClaimAmount(totalClaimAmount)
                .totalApprovedAmount(totalApprovedAmount)
                .monthlyClaimsData(monthlyClaimsData)
                .policyTypeDistribution(policyTypeDistribution)
                .build();
    }

    private List<MonthlyClaimData> getMonthlyClaimsData() {
        List<MonthlyClaimData> monthlyData = new ArrayList<>();
        LocalDate now = LocalDate.now();
        
        for (int i = 5; i >= 0; i--) {
            LocalDate monthStart = now.minusMonths(i).withDayOfMonth(1);
            LocalDate monthEnd = monthStart.plusMonths(1).minusDays(1);
            LocalDateTime startDateTime = monthStart.atStartOfDay();
            LocalDateTime endDateTime = monthEnd.atTime(23, 59, 59);
            
            List<Claim> monthClaims = claimRepository.findByCreatedAtBetween(startDateTime, endDateTime);
            
            long submitted = monthClaims.stream()
                    .filter(c -> c.getStatus() == ClaimStatus.SUBMITTED || c.getStatus() == ClaimStatus.IN_REVIEW)
                    .count();
            
            long approved = monthClaims.stream()
                    .filter(c -> c.getStatus() == ClaimStatus.APPROVED)
                    .count();
            
            long rejected = monthClaims.stream()
                    .filter(c -> c.getStatus() == ClaimStatus.REJECTED)
                    .count();
            
            String monthName = monthStart.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            
            monthlyData.add(MonthlyClaimData.builder()
                    .month(monthName)
                    .submitted(submitted)
                    .approved(approved)
                    .rejected(rejected)
                    .build());
        }
        
        return monthlyData;
    }

    private List<PolicyTypeDistribution> getPolicyTypeDistribution() {
        Map<PolicyType, Long> policyCounts = policyRepository.findAll().stream()
                .collect(Collectors.groupingBy(Policy::getPolicyType, Collectors.counting()));
        
        return policyCounts.entrySet().stream()
                .map(entry -> PolicyTypeDistribution.builder()
                        .policyType(entry.getKey().name())
                        .count(entry.getValue())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public CustomerDashboardStatsDto getCustomerDashboardStats(Long userId) {
        Customer customer = customerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found for user id " + userId));

        // Get customer's assigned policies
        List<CustomerPolicy> customerPolicies = customerPolicyRepository.findByCustomerId(customer.getId());
        long totalPolicies = customerPolicies.size();
        long activePolicies = customerPolicies.stream()
                .filter(cp -> cp.getPolicy().getStatus() == PolicyStatus.ACTIVE)
                .count();

        // Get customer's claims
        List<Claim> customerClaims = claimRepository.findByCustomerId(customer.getId());
        long totalClaims = customerClaims.size();
        long pendingClaims = customerClaims.stream()
                .filter(c -> c.getStatus() == ClaimStatus.SUBMITTED || c.getStatus() == ClaimStatus.IN_REVIEW)
                .count();
        long approvedClaims = customerClaims.stream()
                .filter(c -> c.getStatus() == ClaimStatus.APPROVED)
                .count();
        long rejectedClaims = customerClaims.stream()
                .filter(c -> c.getStatus() == ClaimStatus.REJECTED)
                .count();

        // Get monthly claims data for customer
        List<MonthlyClaimData> monthlyClaimsData = getCustomerMonthlyClaimsData(customer.getId());

        return CustomerDashboardStatsDto.builder()
                .totalPolicies(totalPolicies)
                .activePolicies(activePolicies)
                .totalClaims(totalClaims)
                .pendingClaims(pendingClaims)
                .approvedClaims(approvedClaims)
                .rejectedClaims(rejectedClaims)
                .monthlyClaimsData(monthlyClaimsData)
                .build();
    }

    private List<MonthlyClaimData> getCustomerMonthlyClaimsData(UUID customerId) {
        List<MonthlyClaimData> monthlyData = new ArrayList<>();
        LocalDate now = LocalDate.now();
        
        for (int i = 5; i >= 0; i--) {
            LocalDate monthStart = now.minusMonths(i).withDayOfMonth(1);
            LocalDate monthEnd = monthStart.plusMonths(1).minusDays(1);
            LocalDateTime startDateTime = monthStart.atStartOfDay();
            LocalDateTime endDateTime = monthEnd.atTime(23, 59, 59);
            
            // Get customer's claims for this month
            List<Claim> monthClaims = claimRepository.findByCustomerId(customerId).stream()
                    .filter(c -> {
                        LocalDateTime createdAt = c.getCreatedAt();
                        return createdAt != null && 
                               createdAt.isAfter(startDateTime) && 
                               createdAt.isBefore(endDateTime);
                    })
                    .collect(Collectors.toList());
            
            long submitted = monthClaims.stream()
                    .filter(c -> c.getStatus() == ClaimStatus.SUBMITTED || c.getStatus() == ClaimStatus.IN_REVIEW)
                    .count();
            
            long approved = monthClaims.stream()
                    .filter(c -> c.getStatus() == ClaimStatus.APPROVED)
                    .count();
            
            long rejected = monthClaims.stream()
                    .filter(c -> c.getStatus() == ClaimStatus.REJECTED)
                    .count();
            
            String monthName = monthStart.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            
            monthlyData.add(MonthlyClaimData.builder()
                    .month(monthName)
                    .submitted(submitted)
                    .approved(approved)
                    .rejected(rejected)
                    .build());
        }
        
        return monthlyData;
    }
}

