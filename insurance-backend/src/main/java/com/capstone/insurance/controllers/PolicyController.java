package com.capstone.insurance.controllers;

import com.capstone.insurance.dto.policy.AssignPolicyRequest;
import com.capstone.insurance.dto.policy.PolicyCreateRequest;
import com.capstone.insurance.dto.policy.PolicyDto;
import com.capstone.insurance.services.PolicyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/policies")
@RequiredArgsConstructor
public class PolicyController {

    private final PolicyService policyService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<PolicyDto> createPolicy(
            @Valid @RequestBody PolicyCreateRequest request) {
        return ResponseEntity.ok(policyService.createPolicy(request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<PolicyDto>> getAllPolicies() {
        return ResponseEntity.ok(policyService.getAllPolicies());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<PolicyDto> getPolicyById(@PathVariable Long id) {
        return ResponseEntity.ok(policyService.getPolicyById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/customers/{customerId}/assign")
    public ResponseEntity<Void> assignPolicyToCustomer(
            @PathVariable Long customerId,
            @Valid @RequestBody AssignPolicyRequest request) {
        policyService.assignPolicyToCustomer(customerId, request);
        return ResponseEntity.ok().build();
    }
}
