package com.capstone.insurance.repositories;

import com.capstone.insurance.entities.Claim;
import com.capstone.insurance.entities.enums.ClaimStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface ClaimRepository extends JpaRepository<Claim, Long> {

    List<Claim> findByCustomerId(UUID customerId);

    List<Claim> findByStatus(ClaimStatus status);

    Page<Claim> findByStatus(ClaimStatus status, Pageable pageable);

    List<Claim> findByStatusAndCreatedAtBetween(
            ClaimStatus status,
            LocalDateTime from,
            LocalDateTime to);

    Page<Claim> findByStatusAndCreatedAtBetween(
            ClaimStatus status,
            LocalDateTime from,
            LocalDateTime to,
            Pageable pageable);

    List<Claim> findByCreatedAtBetween(LocalDateTime from, LocalDateTime to);

    Page<Claim> findByCreatedAtBetween(LocalDateTime from, LocalDateTime to, Pageable pageable);
    
    // Find all claims sorted by createdAt descending (newest first)
    List<Claim> findAll(Sort sort);
}
