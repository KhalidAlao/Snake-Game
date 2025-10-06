package com.snakegame.backend.controller;

import com.snakegame.backend.model.LeaderboardEntry;
import com.snakegame.backend.service.LeaderboardService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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
public ResponseEntity<String> addEntry(@RequestBody LeaderboardEntry entry) {
    leaderboardService.addEntry(entry.getName(), entry.getScore());
    return ResponseEntity.ok("Entry added successfully");
}

@DeleteMapping
public ResponseEntity<String> clearLeaderboard() {
    leaderboardService.clearLeaderboard();
    return ResponseEntity.ok("Leaderboard cleared");
}

}
