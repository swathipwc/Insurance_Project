package com.capstone.insurance.dto.activity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ActivityLogCreateRequest {

    @NotNull
    private Long userId;

    @NotBlank
    private String actionType;

    private String details;
}

