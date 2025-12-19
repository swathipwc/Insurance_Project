package com.capstone.insurance.dto.dashboard;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class AdminDashboardStatsDto {
    private Long totalCustomers;
    private Long totalPolicies;
    private Long totalClaims;
    private Long pendingClaims;
    private Long approvedClaims;
    private Long rejectedClaims;
    private BigDecimal totalCoverageAmount;
    private BigDecimal totalClaimAmount;
    private BigDecimal totalApprovedAmount;
    private List<MonthlyClaimData> monthlyClaimsData;
    private List<PolicyTypeDistribution> policyTypeDistribution;
}

