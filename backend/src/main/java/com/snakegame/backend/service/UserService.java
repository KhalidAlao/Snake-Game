package com.snakegame.backend.service;

import com.snakegame.backend.model.User;
import com.snakegame.backend.repository.UserRepository;
import com.snakegame.backend.util.ValidationUtil;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(String username, String password) {
        if (!ValidationUtil.isValidPassword(password)) throw new IllegalArgumentException("Password invalid");
        String hash = passwordEncoder.encode(password);
        User u = new User(username, hash);
        return userRepository.save(u);
    }

    public boolean validateUser(String username, String password) {
        return userRepository.findByUsername(username)
                .map(u -> passwordEncoder.matches(password, u.getPasswordHash()))
                .orElse(false);
    }

    public boolean existsByUsername(String username) {
        return userRepository.findByUsername(username).isPresent();
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User u = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        // Use Spring's User class to return username, password (hashed) and no authorities
        return new org.springframework.security.core.userdetails.User(u.getUsername(), u.getPasswordHash(), Collections.emptyList());
    }
}
