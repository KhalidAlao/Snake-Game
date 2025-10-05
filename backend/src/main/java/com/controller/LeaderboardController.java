package com.controller;

import com.model.LeaderboardEntry;
import com.service.LeaderboardService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    // GET top leaderboard
    @GetMapping
    public List<LeaderboardEntry> getLeaderboard() {
        return leaderboardService.getTopEntries();
    }

    // POST new entry
    @PostMapping
    public void addEntry(@RequestBody LeaderboardEntry entry) {
        leaderboardService.addEntry(entry.getName(), entry.getScore());
    }
}
