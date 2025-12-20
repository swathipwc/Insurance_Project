package com.capstone.insurance.dto.customer;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class CustomerDto {
    private UUID id; // Internal ID for API operations (not displayed in UI)
    private String customerCode;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String username; // Show username but not password
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
