package com.capstone.insurance.repositories;

import com.capstone.insurance.entities.CustomerPolicy;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerPolicyRepository extends JpaRepository<CustomerPolicy, Long> {

    boolean existsByCustomerIdAndPolicyId(Long customerId, Long policyId);
}
