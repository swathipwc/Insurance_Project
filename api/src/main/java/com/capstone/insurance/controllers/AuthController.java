package com.capstone.insurance.controllers;

import com.capstone.insurance.dto.auth.AuthResponse;
import com.capstone.insurance.dto.auth.LoginRequest;
import com.capstone.insurance.dto.auth.RefreshTokenRequest;
import com.capstone.insurance.entities.Customer;
import com.capstone.insurance.entities.RefreshToken;
import com.capstone.insurance.entities.User;
import com.capstone.insurance.repositories.CustomerRepository;
import com.capstone.insurance.repositories.UserRepository;
import com.capstone.insurance.security.CustomUserDetailsService;
import com.capstone.insurance.security.jwt.JwtTokenProvider;
import com.capstone.insurance.security.model.UserPrincipal;
import com.capstone.insurance.services.RefreshTokenService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final RefreshTokenService refreshTokenService;
    private final CustomUserDetailsService customUserDetailsService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse httpResponse) {

        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException ex) {
            throw new BadCredentialsException("Invalid username or password");
        }

        String accessToken = jwtTokenProvider.generateToken(authentication);

        // Find user by username or email
        // The authentication already succeeded, so we need to find the user
        // Try username first, then email (for customers)
        User user = userRepository.findByUsername(request.getUsername())
                .orElse(null);
        
        // If not found by username, try to find by email (for customers)
        if (user == null) {
            Customer customer = customerRepository.findByEmail(request.getUsername())
                    .orElseThrow(() -> new BadCredentialsException("User not found"));
            user = customer.getUser();
        }

        // Create refresh token
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        // Set refresh token in HTTP-only cookie
        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken.getToken());
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(false); // Set to true in production with HTTPS
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(7 * 24 * 60 * 60); // 7 days in seconds
        httpResponse.addCookie(refreshTokenCookie);

        AuthResponse response = new AuthResponse(
                accessToken,
                user.getUsername(),
                user.getRole().name(),
                user.getId()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(
            @CookieValue(value = "refreshToken", required = false) String refreshToken,
            @RequestBody(required = false) RefreshTokenRequest request) {

        // Try to get refresh token from cookie first, then from request body
        String token = refreshToken != null ? refreshToken : 
                       (request != null ? request.getRefreshToken() : null);

        if (token == null || token.isEmpty()) {
            throw new BadCredentialsException("Refresh token is required");
        }

        // Verify and get refresh token
        RefreshToken refreshTokenEntity = refreshTokenService.verifyExpiration(
                refreshTokenService.findByToken(token)
        );

        // Get user and generate new access token
        User user = refreshTokenEntity.getUser();
        UserPrincipal userPrincipal = (UserPrincipal) customUserDetailsService.loadUserByUsername(user.getUsername());
        
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userPrincipal,
                null,
                userPrincipal.getAuthorities()
        );

        String newAccessToken = jwtTokenProvider.generateToken(authentication);

        AuthResponse response = new AuthResponse(
                newAccessToken,
                user.getUsername(),
                user.getRole().name(),
                user.getId()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @CookieValue(value = "refreshToken", required = false) String refreshToken,
            HttpServletResponse httpResponse) {

        if (refreshToken != null && !refreshToken.isEmpty()) {
            try {
                RefreshToken token = refreshTokenService.findByToken(refreshToken);
                refreshTokenService.deleteByUserId(token.getUser().getId());
            } catch (Exception e) {
                // Token might already be deleted, ignore
            }
        }

        // Clear refresh token cookie
        Cookie refreshTokenCookie = new Cookie("refreshToken", null);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(false);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(0);
        httpResponse.addCookie(refreshTokenCookie);

        return ResponseEntity.ok().build();
    }
}
