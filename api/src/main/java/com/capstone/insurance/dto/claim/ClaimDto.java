package com.capstone.insurance.dto.claim;

import com.capstone.insurance.entities.enums.ClaimStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class ClaimDto {

    private Long id;
    private String claimNumber; // Formatted claim ID for display
    private java.util.UUID customerId;
    private java.util.UUID policyId;
    private String policyNumber; // Policy number from CustomerPolicy
    private LocalDate claimDate;
    private Double claimAmount;
    private ClaimStatus status;
    private String description;
    private String remarks;
    private String evidenceUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
