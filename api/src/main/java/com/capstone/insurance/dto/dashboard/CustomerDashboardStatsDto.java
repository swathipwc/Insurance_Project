package com.capstone.insurance.dto.dashboard;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class CustomerDashboardStatsDto {
    private Long totalPolicies;
    private Long activePolicies;
    private Long totalClaims;
    private Long pendingClaims;
    private Long approvedClaims;
    private Long rejectedClaims;
    private List<MonthlyClaimData> monthlyClaimsData;
}

