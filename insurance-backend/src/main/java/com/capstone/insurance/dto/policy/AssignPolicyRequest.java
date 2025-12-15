package com.capstone.insurance.dto.policy;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AssignPolicyRequest {

    @NotNull
    private Long policyId;
}
