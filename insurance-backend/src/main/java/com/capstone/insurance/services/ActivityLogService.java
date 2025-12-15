package com.capstone.insurance.services;

public interface ActivityLogService {

    void logAction(Long userId, String actionType, String details);
}
