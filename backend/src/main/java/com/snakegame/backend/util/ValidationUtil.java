package com.snakegame.backend.util;

import org.springframework.stereotype.Component;

@Component
public class ValidationUtil {

    public static String sanitizeName(String name) {
        if (name == null) return null;
        
        // Remove HTML tags and limit length
        String sanitized = name.replaceAll("<[^>]*>", "")
                              .replaceAll("[^a-zA-Z0-9\\s_-]", "")
                              .trim();
        
        return sanitized.length() > 20 ? sanitized.substring(0, 20) : sanitized;
    }

    public static boolean isValidPassword(String password) {
        return password != null && 
               password.length() >= 6 && 
               password.length() <= 100;
    }

    public static boolean isValidScore(int score) {
        return score >= 0 && score <= 10000; // Reasonable max score
    }

    public static boolean isValidUsername(String username) {
        return username != null && 
               username.length() >= 3 && 
               username.length() <= 20 &&
               username.matches("^[a-zA-Z0-9_-]+$");
    }
}