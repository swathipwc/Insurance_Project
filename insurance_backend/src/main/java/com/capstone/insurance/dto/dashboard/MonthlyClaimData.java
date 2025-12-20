package com.capstone.insurance.dto.dashboard;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MonthlyClaimData {
    private String month;
    private Long submitted;
    private Long approved;
    private Long rejected;
}

