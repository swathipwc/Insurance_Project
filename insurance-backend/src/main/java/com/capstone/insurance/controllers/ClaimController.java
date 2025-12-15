package com.capstone.insurance.controllers;

import com.capstone.insurance.dto.claim.ClaimCreateRequest;
import com.capstone.insurance.dto.claim.ClaimDto;
import com.capstone.insurance.dto.claim.ClaimStatusUpdateRequest;
import com.capstone.insurance.security.model.UserPrincipal;
import com.capstone.insurance.services.ClaimService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ClaimController {

    private final ClaimService claimService;

    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/api/claims")
    public ResponseEntity<ClaimDto> createClaim(
            Authentication authentication,
            @Valid @RequestBody ClaimCreateRequest request) {

        UserPrincipal user = (UserPrincipal) authentication.getPrincipal();
        return ResponseEntity.ok(claimService.createClaim(user.getId(), request));
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/api/claims/me")
    public ResponseEntity<List<ClaimDto>> getMyClaims(Authentication authentication) {
        UserPrincipal user = (UserPrincipal) authentication.getPrincipal();
        return ResponseEntity.ok(claimService.getMyClaims(user.getId()));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/api/admin/claims")
    public ResponseEntity<List<ClaimDto>> getAllClaims(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {

        return ResponseEntity.ok(claimService.getAllClaims(status, from, to));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/api/admin/claims/{id}/status")
    public ResponseEntity<ClaimDto> updateClaimStatus(
            @PathVariable Long id,
            Authentication authentication,
            @Valid @RequestBody ClaimStatusUpdateRequest request) {

        UserPrincipal user = (UserPrincipal) authentication.getPrincipal();
        return ResponseEntity.ok(claimService.updateClaimStatus(id, request, user.getId()));
    }
}
