package com.capstone.insurance.services;

import com.capstone.insurance.entities.RefreshToken;

public interface RefreshTokenService {
    
    RefreshToken createRefreshToken(Long userId);
    
    RefreshToken verifyExpiration(RefreshToken token);
    
    RefreshToken findByToken(String token);
    
    int deleteByUserId(Long userId);
}

