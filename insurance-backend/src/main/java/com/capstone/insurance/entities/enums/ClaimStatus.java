package com.capstone.insurance.entities.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ClaimStatus {
    SUBMITTED("Submitted"),
    IN_REVIEW("In Review"),
    APPROVED("Approved"),
    REJECTED("Rejected");

    private final String displayName;

    ClaimStatus(String displayName) {
        this.displayName = displayName;
    }

    @JsonValue
    public String getDisplayName() {
        return displayName;
    }

    @JsonCreator
    public static ClaimStatus fromString(String value) {
        if (value == null) {
            return null;
        }
        
        // Try exact enum name match first (uppercase with underscore)
        for (ClaimStatus status : ClaimStatus.values()) {
            if (status.name().equalsIgnoreCase(value) || 
                status.name().replace("_", " ").equalsIgnoreCase(value)) {
                return status;
            }
        }
        
        // Try display name match (with spaces and title case)
        for (ClaimStatus status : ClaimStatus.values()) {
            if (status.displayName.equalsIgnoreCase(value)) {
                return status;
            }
        }
        
        // Fallback: try to match common variations
        String normalized = value.trim();
        if (normalized.equalsIgnoreCase("submitted")) return SUBMITTED;
        if (normalized.equalsIgnoreCase("in review") || normalized.equalsIgnoreCase("in_review")) return IN_REVIEW;
        if (normalized.equalsIgnoreCase("approved")) return APPROVED;
        if (normalized.equalsIgnoreCase("rejected")) return REJECTED;
        
        throw new IllegalArgumentException("Unknown ClaimStatus: " + value);
    }
}
