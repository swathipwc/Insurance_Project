package com.capstone.insurance.dto.claim;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ClaimCreateRequest {

    @NotNull
    private java.util.UUID policyId;

    private LocalDate claimDate;

    @NotNull
    @Min(0)
    private Double claimAmount;

    private String description;

    private String evidenceUrl;
}
