package com.capstone.insurance.services;

import com.capstone.insurance.dto.policy.AssignPolicyRequest;
import com.capstone.insurance.dto.policy.PolicyCreateRequest;
import com.capstone.insurance.dto.policy.PolicyDto;

import java.util.List;

public interface PolicyService {

    PolicyDto createPolicy(PolicyCreateRequest request);

    List<PolicyDto> getAllPolicies();

    PolicyDto getPolicyById(Long id);

    void assignPolicyToCustomer(Long customerId, AssignPolicyRequest request);
}
