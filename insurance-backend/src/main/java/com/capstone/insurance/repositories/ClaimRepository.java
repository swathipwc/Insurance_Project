package com.capstone.insurance.repositories;

import com.capstone.insurance.entities.Claim;
import com.capstone.insurance.entities.enums.ClaimStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ClaimRepository extends JpaRepository<Claim, Long> {

    List<Claim> findByCustomerId(Long customerId);

    List<Claim> findByStatus(ClaimStatus status);

    List<Claim> findByStatusAndCreatedAtBetween(
            ClaimStatus status,
            LocalDateTime from,
            LocalDateTime to);

    List<Claim> findByCreatedAtBetween(LocalDateTime from, LocalDateTime to);
}
