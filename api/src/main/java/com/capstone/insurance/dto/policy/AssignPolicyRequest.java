package com.capstone.insurance.dto.policy;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AssignPolicyRequest {

    @NotNull
    private java.util.UUID policyId;
}
