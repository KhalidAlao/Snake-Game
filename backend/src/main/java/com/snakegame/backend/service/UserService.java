package com.snakegame.backend.service;

import com.snakegame.backend.model.User;
import com.snakegame.backend.repository.UserRepository;
import com.snakegame.backend.util.ValidationUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(String username, String password) {
        if (!ValidationUtil.isValidPassword(password)) {
            throw new IllegalArgumentException("Password must be 6-100 characters");
        }
        
        String hashed = passwordEncoder.encode(password);
        User user = new User(username, hashed);
        return userRepository.save(user);
    }

    public boolean validateUser(String username, String password) {
        return userRepository.findByUsername(username)
                .map(u -> passwordEncoder.matches(password, u.getPasswordHash()))
                .orElse(false);
    }

    public boolean existsByUsername(String username) {
        return userRepository.findByUsername(username).isPresent();
    }
}