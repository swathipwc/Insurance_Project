package com.capstone.insurance.services;

import com.capstone.insurance.dto.dashboard.AdminDashboardStatsDto;
import com.capstone.insurance.dto.dashboard.CustomerDashboardStatsDto;

public interface DashboardService {
    AdminDashboardStatsDto getAdminDashboardStats();
    CustomerDashboardStatsDto getCustomerDashboardStats(Long userId);
}

