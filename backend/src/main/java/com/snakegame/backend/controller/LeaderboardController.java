package com.snakegame.backend.controller;

import com.snakegame.backend.model.LeaderboardEntry;
import com.snakegame.backend.model.ScoreRequest;
import com.snakegame.backend.service.LeaderboardService;
import com.snakegame.backend.util.ValidationUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;


import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    @GetMapping
    public List<LeaderboardEntry> getLeaderboard() {
        return leaderboardService.getTopEntries();
    }

    @PostMapping
    public ResponseEntity<?> addEntry(@RequestBody ScoreRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            return ResponseEntity.status(401).body(Map.of("error","Unauthorized"));
        }
        String username = auth.getName();
        int score = request.getScore();
        if (!ValidationUtil.isValidScore(score)) {
            return ResponseEntity.badRequest().body(Map.of("error","Invalid score"));
        }
        String sanitized = ValidationUtil.sanitizeName(username);
        leaderboardService.addEntry(sanitized, score);
        return ResponseEntity.ok(Map.of("message","Entry added"));
    }

    @DeleteMapping
    public ResponseEntity<?> clearLeaderboard() {
        leaderboardService.clearLeaderboard();
        return ResponseEntity.ok(Map.of("message","Leaderboard cleared"));
    }
}
