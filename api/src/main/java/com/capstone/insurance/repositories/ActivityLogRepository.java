package com.capstone.insurance.repositories;

import com.capstone.insurance.entities.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
}
