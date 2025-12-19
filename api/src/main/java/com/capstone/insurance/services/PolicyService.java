package com.capstone.insurance.services;

import com.capstone.insurance.dto.policy.AssignPolicyRequest;
import com.capstone.insurance.dto.policy.CustomerPolicyDto;
import com.capstone.insurance.dto.policy.PolicyCreateRequest;
import com.capstone.insurance.dto.policy.PolicyDto;
import com.capstone.insurance.dto.policy.PolicyUpdateRequest;

import java.util.List;
import java.util.UUID;

public interface PolicyService {

    PolicyDto createPolicy(PolicyCreateRequest request);

    List<PolicyDto> getAllPolicies();

    PolicyDto getPolicyById(UUID id);

    PolicyDto updatePolicy(UUID id, PolicyUpdateRequest request);

    void assignPolicyToCustomer(UUID customerId, AssignPolicyRequest request);

    List<CustomerPolicyDto> getCustomerPolicies(Long userId);
}
