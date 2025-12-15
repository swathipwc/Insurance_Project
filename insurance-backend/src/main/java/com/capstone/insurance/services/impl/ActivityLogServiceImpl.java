package com.capstone.insurance.services.impl;

import com.capstone.insurance.entities.ActivityLog;
import com.capstone.insurance.entities.User;
import com.capstone.insurance.exceptions.ResourceNotFoundException;
import com.capstone.insurance.repositories.ActivityLogRepository;
import com.capstone.insurance.repositories.UserRepository;
import com.capstone.insurance.services.ActivityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
}
