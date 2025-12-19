package com.capstone.insurance.dto.activity;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ActivityLogDto {
    private Long id;
    private Long userId;
    private String username;
    private String actionType;
    private String details;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

