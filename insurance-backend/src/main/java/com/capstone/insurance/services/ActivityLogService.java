package com.capstone.insurance.services;

import com.capstone.insurance.dto.common.PaginatedResponse;
import com.capstone.insurance.dto.activity.ActivityLogCreateRequest;
import com.capstone.insurance.dto.activity.ActivityLogDto;

import java.util.List;

public interface ActivityLogService {

    void logAction(Long userId, String actionType, String details);

    List<ActivityLogDto> getAllActivityLogs();

    PaginatedResponse<ActivityLogDto> getAllActivityLogsPaginated(int page);

    ActivityLogDto createActivityLog(ActivityLogCreateRequest request);
}
