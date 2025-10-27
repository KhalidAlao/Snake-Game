package com.snakegame.backend.util;

public class ValidationUtil {
    public static boolean isValidScore(int s) {
        return s >= 0 && s <= 1000000;
    }
    public static boolean isValidPassword(String p) {
        return p != null && p.length() >= 6 && p.length() <= 200;
    }
    public static String sanitizeName(String s) {
        if (s == null) return null;
        return s.replaceAll("[^A-Za-z0-9_\\-]", "").trim();
    }
}
