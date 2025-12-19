package com.capstone.insurance.dto.policy;

import com.capstone.insurance.entities.enums.PolicyStatus;
import com.capstone.insurance.entities.enums.PolicyType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class PolicyDto {
    private java.util.UUID id;
    private String policyCode;
    private PolicyType policyType;
    private Double coverageAmount;
    private LocalDate startDate;
    private LocalDate endDate;
    private PolicyStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
