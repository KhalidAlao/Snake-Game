package com.snakegame.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import java.util.Date;

public class JwtUtil {

    // FIXED: Use the new API to generate key - no more SignatureAlgorithm
    private static final SecretKey key = Keys.hmacShaKeyFor(
        "mySuperSecretKeyThatIsAtLeast32BytesLong!".getBytes()
    );
    
    private static final long EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24h

    public static String generateToken(String username) {
        return Jwts.builder()
                .subject(username)
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(key)
                .compact();
    }

    public static String validateTokenAndGetUsername(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getSubject();
        } catch (JwtException e) {
            throw new JwtException("Invalid JWT token", e);
        }
    }
}