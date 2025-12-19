package com.capstone.insurance.dto.dashboard;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PolicyTypeDistribution {
    private String policyType;
    private Long count;
}

