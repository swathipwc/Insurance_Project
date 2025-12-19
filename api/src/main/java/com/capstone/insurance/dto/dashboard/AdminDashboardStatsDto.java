package com.capstone.insurance.dto.dashboard;

import lombok.Builder;
import lombok.Data;

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
    private Double totalCoverageAmount;
    private Double totalClaimAmount;
    private Double totalApprovedAmount;
    private List<MonthlyClaimData> monthlyClaimsData;
    private List<PolicyTypeDistribution> policyTypeDistribution;
}

