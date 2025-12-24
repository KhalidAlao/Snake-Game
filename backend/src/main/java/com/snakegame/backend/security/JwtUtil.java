package com.snakegame.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.security.Key;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret:}")
    private String secret;

    @Value("${jwt.expiration:86400000}")
    private long expirationMs;
    
    @Value("${jwt.issuer:snakegame-backend}")
    private String issuer;
    
    private final Environment environment;
    private Key key;

    public JwtUtil(Environment environment) {
        this.environment = environment;
    }

    @PostConstruct
    public void init() {
        // Check if using default secret in production
        String[] activeProfiles = environment.getActiveProfiles();
        boolean isProduction = false;
        for (String profile : activeProfiles) {
            if (profile.equalsIgnoreCase("prod") || profile.equalsIgnoreCase("production")) {
                isProduction = true;
                break;
            }
        }
        
        // In production, require a proper secret
        if (isProduction && (secret.isEmpty() || secret.equals("default_secret_key_change_this"))) {
            throw new IllegalStateException(
                "JWT secret must be set in production! Set JWT_SECRET environment variable."
            );
        }
        
        // For development, generate a secure secret if not set
        if (secret.isEmpty() || secret.equals("default_secret_key_change_this")) {
            secret = generateSecureSecret();
            System.out.println("⚠️  WARNING: Using auto-generated JWT secret for development only!");
            System.out.println("   Set JWT_SECRET environment variable for production.");
            System.out.println("   Generated secret (save for testing): " + secret);
        }
        
        byte[] bytes = secret.getBytes();
        if (bytes.length < 32) {
            System.err.println("⚠️  WARNING: JWT secret is too short (" + bytes.length + " bytes).");
            System.err.println("   For better security, use at least 32 bytes (256 bits).");
        }
        
        key = Keys.hmacShaKeyFor(bytes);
    }
    
    private String generateSecureSecret() {
        // Generate a secure random 32-byte secret
        byte[] randomBytes = new byte[32];
        new java.security.SecureRandom().nextBytes(randomBytes);
        return Base64.getEncoder().encodeToString(randomBytes);
    }

    public String generateToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .setSubject(username)
                .setIssuer(issuer)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return parseClaims(token).getSubject();
    }
    
    public Date extractExpiration(String token) {
        return parseClaims(token).getExpiration();
    }

    public boolean validateToken(String token) {
        try {
            Claims claims = parseClaims(token);
            
            // Additional validation checks
            if (!claims.getIssuer().equals(issuer)) {
                System.out.println("Invalid JWT issuer: " + claims.getIssuer());
                return false;
            }
            
            if (claims.getExpiration().before(new Date())) {
                System.out.println("JWT token expired");
                return false;
            }
            
            return true;
        } catch (ExpiredJwtException e) {
            System.out.println("JWT token expired: " + e.getMessage());
            return false;
        } catch (SignatureException e) {
            System.out.println("Invalid JWT signature: " + e.getMessage());
            return false;
        } catch (MalformedJwtException e) {
            System.out.println("Invalid JWT token: " + e.getMessage());
            return false;
        } catch (IllegalArgumentException e) {
            System.out.println("JWT claims string is empty: " + e.getMessage());
            return false;
        } catch (JwtException e) {
            System.out.println("JWT error: " + e.getMessage());
            return false;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}