package com.capstone.insurance.services.impl;

import com.capstone.insurance.dto.common.PaginatedResponse;
import com.capstone.insurance.dto.activity.ActivityLogCreateRequest;
import com.capstone.insurance.dto.activity.ActivityLogDto;
import com.capstone.insurance.entities.ActivityLog;
import com.capstone.insurance.entities.User;
import com.capstone.insurance.exceptions.ResourceNotFoundException;
import com.capstone.insurance.repositories.ActivityLogRepository;
import com.capstone.insurance.repositories.UserRepository;
import com.capstone.insurance.services.ActivityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActivityLogServiceImpl implements ActivityLogService {

    private final ActivityLogRepository activityLogRepository;
    private final UserRepository userRepository;

    @Override
    public void logAction(Long userId, String actionType, String details) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));

        ActivityLog log = ActivityLog.builder()
                .user(user)
                .actionType(actionType)
                .details(details)
                .build();

        activityLogRepository.save(log);
    }

    @Override
    public List<ActivityLogDto> getAllActivityLogs() {
        return activityLogRepository.findAll()
                .stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt())) // Most recent first
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public PaginatedResponse<ActivityLogDto> getAllActivityLogsPaginated(int page) {
        Pageable pageable = PageRequest.of(page, 10, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<ActivityLog> activityLogPage = activityLogRepository.findAll(pageable);
        
        List<ActivityLogDto> content = activityLogPage.getContent()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        
        return PaginatedResponse.<ActivityLogDto>builder()
                .content(content)
                .currentPage(page)
                .pageSize(10)
                .totalElements(activityLogPage.getTotalElements())
                .totalPages(activityLogPage.getTotalPages())
                .hasNext(activityLogPage.hasNext())
                .hasPrevious(activityLogPage.hasPrevious())
                .build();
    }

    @Override
    public ActivityLogDto createActivityLog(ActivityLogCreateRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + request.getUserId()));

        ActivityLog log = ActivityLog.builder()
                .user(user)
                .actionType(request.getActionType())
                .details(request.getDetails())
                .build();

        activityLogRepository.save(log);
        return toDto(log);
    }

    private ActivityLogDto toDto(ActivityLog log) {
        return ActivityLogDto.builder()
                .id(log.getId())
                .userId(log.getUser().getId())
                .username(log.getUser().getUsername())
                .actionType(log.getActionType())
                .details(log.getDetails())
                .createdAt(log.getCreatedAt())
                .updatedAt(log.getUpdatedAt())
                .build();
    }
}
