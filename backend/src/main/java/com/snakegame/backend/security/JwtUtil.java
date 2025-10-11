package com.snakegame.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JwtUtil - generates and validates JWT tokens.
 * Reads secret from environment variable JWT_SECRET first, then from property jwt.secret.
 */
@Component
public class JwtUtil {

    private final SecretKey key;
    private final long expirationMs = 3_600_000L; // 1 hour

    public JwtUtil(
            @Value("${JWT_SECRET:}") String envSecret,
            @Value("${jwt.secret:}") String propSecret
    ) {
        String secretKey = (envSecret != null && !envSecret.isBlank()) ? envSecret : propSecret;
        if (secretKey == null || secretKey.isBlank()) {
            throw new IllegalStateException("JWT secret is required. Set environment variable JWT_SECRET or property jwt.secret");
        }
        if (secretKey.length() < 32) {
            throw new IllegalArgumentException("JWT secret must be at least 32 characters long for secure HMAC-SHA algorithms");
        }
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Generate a signed JWT for the provided username.
     */
    public String generateToken(String username) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expirationMs);
        
        return Jwts.builder()
                .subject(username) 
                .issuedAt(now)     
                .expiration(exp)   
                .signWith(key)
                .compact();
    }

    /**
     * Validate the token and return the subject (username).
     * Throws JwtException on invalid tokens.
     */
    public String validateTokenAndGetUsername(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(key) // Use verifyWith for SecretKey
                    .build()
                    .parseSignedClaims(token) // Use parseSignedClaims for signed tokens
                    .getPayload();
            
            return claims.getSubject();
        } catch (JwtException e) {
            throw new JwtException("Invalid JWT token: " + e.getMessage(), e);
        }
    }
}