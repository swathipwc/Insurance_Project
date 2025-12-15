package com.capstone.insurance.services.impl;

import com.capstone.insurance.dto.policy.AssignPolicyRequest;
import com.capstone.insurance.dto.policy.PolicyCreateRequest;
import com.capstone.insurance.dto.policy.PolicyDto;
import com.capstone.insurance.entities.Customer;
import com.capstone.insurance.entities.CustomerPolicy;
import com.capstone.insurance.entities.Policy;
import com.capstone.insurance.exceptions.BadRequestException;
import com.capstone.insurance.exceptions.ResourceNotFoundException;
import com.capstone.insurance.repositories.CustomerPolicyRepository;
import com.capstone.insurance.repositories.CustomerRepository;
import com.capstone.insurance.repositories.PolicyRepository;
import com.capstone.insurance.services.PolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PolicyServiceImpl implements PolicyService {

    private final PolicyRepository policyRepository;
    private final CustomerRepository customerRepository;
    private final CustomerPolicyRepository customerPolicyRepository;

    @Override
    public PolicyDto createPolicy(PolicyCreateRequest request) {
        if (policyRepository.findByPolicyNumber(request.getPolicyNumber()).isPresent()) {
            throw new BadRequestException("Policy number already exists");
        }

        Policy policy = Policy.builder()
                .policyNumber(request.getPolicyNumber())
                .policyType(request.getPolicyType())
                .premiumAmount(request.getPremiumAmount())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();
        policyRepository.save(policy);

        return toDto(policy);
    }

    @Override
    public List<PolicyDto> getAllPolicies() {
        return policyRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public PolicyDto getPolicyById(Long id) {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found with id " + id));
        return toDto(policy);
    }

    @Override
    public void assignPolicyToCustomer(Long customerId, AssignPolicyRequest request) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id " + customerId));

        Policy policy = policyRepository.findById(request.getPolicyId())
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found with id " + request.getPolicyId()));

        if (customerPolicyRepository.existsByCustomerIdAndPolicyId(customerId, policy.getId())) {
            throw new BadRequestException("Policy already assigned to this customer");
        }

        CustomerPolicy cp = CustomerPolicy.builder()
                .customer(customer)
                .policy(policy)
                .build();
        customerPolicyRepository.save(cp);
    }

    private PolicyDto toDto(Policy p) {
        return PolicyDto.builder()
                .id(p.getId())
                .policyNumber(p.getPolicyNumber())
                .policyType(p.getPolicyType())
                .premiumAmount(p.getPremiumAmount())
                .startDate(p.getStartDate())
                .endDate(p.getEndDate())
                .status(p.getStatus())
                .build();
    }
}
