package com.capstone.insurance.services;

import com.capstone.insurance.dto.common.PaginatedResponse;
import com.capstone.insurance.dto.claim.ClaimCreateRequest;
import com.capstone.insurance.dto.claim.ClaimDto;
import com.capstone.insurance.dto.claim.ClaimStatusUpdateRequest;

import java.time.LocalDate;
import java.util.List;

public interface ClaimService {

    ClaimDto createClaim(Long userId, ClaimCreateRequest request);

    List<ClaimDto> getMyClaims(Long userId);

    List<ClaimDto> getAllClaims(String status, LocalDate from, LocalDate to);

    PaginatedResponse<ClaimDto> getAllClaimsPaginated(int page, String status, LocalDate from, LocalDate to);

    ClaimDto updateClaimStatus(Long claimId, ClaimStatusUpdateRequest request, Long userId);
}
