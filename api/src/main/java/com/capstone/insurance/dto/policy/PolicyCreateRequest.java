package com.capstone.insurance.dto.policy;

import com.capstone.insurance.entities.enums.PolicyType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class PolicyCreateRequest {

    @NotNull
    private PolicyType policyType;

    @NotNull
    @Min(0)
    private Double coverageAmount;

    private LocalDate startDate;
    private LocalDate endDate;
}
