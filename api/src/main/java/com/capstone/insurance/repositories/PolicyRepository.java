package com.capstone.insurance.repositories;

import com.capstone.insurance.entities.Policy;
import com.capstone.insurance.entities.enums.PolicyStatus;
import com.capstone.insurance.entities.enums.PolicyType;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PolicyRepository extends JpaRepository<Policy, UUID> {

    Optional<Policy> findByPolicyCode(String policyCode);

    List<Policy> findByPolicyType(PolicyType type);

    List<Policy> findByStatus(PolicyStatus status);

    Optional<Policy> findTopByOrderByPolicyCodeDesc();
    
    // Find all policies sorted by createdAt descending (newest first)
    List<Policy> findAll(Sort sort);
}
