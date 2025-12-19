package com.capstone.insurance.controllers;

import com.capstone.insurance.dto.policy.CustomerPolicyDto;
import com.capstone.insurance.security.model.UserPrincipal;
import com.capstone.insurance.services.PolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/policy")
@RequiredArgsConstructor
public class CustomerPolicyController {

    private final PolicyService policyService;

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/customer/my-policies")
    public ResponseEntity<List<CustomerPolicyDto>> getMyPolicies(Authentication authentication) {
        UserPrincipal user = (UserPrincipal) authentication.getPrincipal();
        return ResponseEntity.ok(policyService.getCustomerPolicies(user.getId()));
    }
}

