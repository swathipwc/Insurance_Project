package com.capstone.insurance.controllers;

import com.capstone.insurance.dto.activity.ActivityLogCreateRequest;
import com.capstone.insurance.dto.activity.ActivityLogDto;
import com.capstone.insurance.dto.common.PaginatedResponse;
import com.capstone.insurance.services.ActivityLogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/activity-logs")
@RequiredArgsConstructor
public class ActivityLogController {

    private final ActivityLogService activityLogService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<PaginatedResponse<ActivityLogDto>> getAllActivityLogs(
            @RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(activityLogService.getAllActivityLogsPaginated(page));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ActivityLogDto> createActivityLog(
            @Valid @RequestBody ActivityLogCreateRequest request) {
        return ResponseEntity.ok(activityLogService.createActivityLog(request));
    }
}

