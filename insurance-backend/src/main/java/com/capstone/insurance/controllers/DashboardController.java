package com.capstone.insurance.controllers;

import com.capstone.insurance.dto.dashboard.AdminDashboardStatsDto;
import com.capstone.insurance.dto.dashboard.CustomerDashboardStatsDto;
import com.capstone.insurance.security.model.UserPrincipal;
import com.capstone.insurance.services.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/dashboard/stats")
    public ResponseEntity<AdminDashboardStatsDto> getAdminDashboardStats() {
        return ResponseEntity.ok(dashboardService.getAdminDashboardStats());
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/customer/dashboard/stats")
    public ResponseEntity<CustomerDashboardStatsDto> getCustomerDashboardStats(Authentication authentication) {
        UserPrincipal user = (UserPrincipal) authentication.getPrincipal();
        return ResponseEntity.ok(dashboardService.getCustomerDashboardStats(user.getId()));
    }
}

