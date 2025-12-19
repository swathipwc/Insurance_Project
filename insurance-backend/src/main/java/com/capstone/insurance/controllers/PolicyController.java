package com.capstone.insurance.controllers;

import com.capstone.insurance.dto.common.PaginatedResponse;
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
    public ResponseEntity<PaginatedResponse<PolicyDto>> getAllPolicies(
            @RequestParam(defaultValue = "0") int page) {
        return ResponseEntity.ok(policyService.getAllPoliciesPaginated(page));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<PolicyDto> getPolicyById(@PathVariable java.util.UUID id) {
        return ResponseEntity.ok(policyService.getPolicyById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<PolicyDto> updatePolicy(
            @PathVariable java.util.UUID id,
            @Valid @RequestBody com.capstone.insurance.dto.policy.PolicyUpdateRequest request) {
        return ResponseEntity.ok(policyService.updatePolicy(id, request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/customers/{customerId}/assign")
    public ResponseEntity<Void> assignPolicyToCustomer(
            @PathVariable java.util.UUID customerId,
            @Valid @RequestBody AssignPolicyRequest request) {
        policyService.assignPolicyToCustomer(customerId, request);
        return ResponseEntity.ok().build();
    }

}
