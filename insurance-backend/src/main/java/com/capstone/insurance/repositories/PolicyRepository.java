package com.capstone.insurance.repositories;

import com.capstone.insurance.entities.Policy;
import com.capstone.insurance.entities.enums.PolicyStatus;
import com.capstone.insurance.entities.enums.PolicyType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PolicyRepository extends JpaRepository<Policy, Long> {

    Optional<Policy> findByPolicyNumber(String policyNumber);

    List<Policy> findByPolicyType(PolicyType type);

    List<Policy> findByStatus(PolicyStatus status);
}
