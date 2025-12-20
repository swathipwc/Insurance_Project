package com.capstone.insurance.dto.claim;

import com.capstone.insurance.entities.enums.ClaimStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClaimStatusUpdateRequest {

    @NotNull
    private ClaimStatus status;

    private String remarks;
}
