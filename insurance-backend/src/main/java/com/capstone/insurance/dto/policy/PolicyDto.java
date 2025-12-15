package com.capstone.insurance.dto.policy;

import com.capstone.insurance.entities.enums.PolicyStatus;
import com.capstone.insurance.entities.enums.PolicyType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class PolicyDto {
    private Long id;
    private String policyNumber;
    private PolicyType policyType;
    private Double premiumAmount;
    private LocalDate startDate;
    private LocalDate endDate;
    private PolicyStatus status;
}
