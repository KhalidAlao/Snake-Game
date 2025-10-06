package com.snakegame.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @SuppressWarnings("null")
            @Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/api/**")
            .allowedOrigins(
                "http://127.0.0.1:5500",   // Live Server
                "http://localhost:5500",   // alternative host
                "http://localhost:5173",   // Vite (if used)
                "http://127.0.0.1:5173"
            )
            .allowedMethods("GET", "POST", "DELETE")
            .allowedHeaders("*");
}

        };
    }
}
