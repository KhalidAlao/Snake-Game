package com.snakegame.backend.controller;

import com.snakegame.backend.model.LeaderboardEntry;
import com.snakegame.backend.service.LeaderboardService;
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
    public void addEntry(@RequestBody LeaderboardEntry entry) {
        leaderboardService.addEntry(entry.getName(), entry.getScore());
    }
}
