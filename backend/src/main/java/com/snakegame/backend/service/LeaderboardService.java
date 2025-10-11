package com.snakegame.backend.service;

import com.snakegame.backend.model.LeaderboardEntry;
import com.snakegame.backend.repository.LeaderboardRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LeaderboardService {

    private final LeaderboardRepository repository;

    public LeaderboardService(LeaderboardRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public void addEntry(String name, int score) {
        // First, get current top entries to see if we need to prune
        List<LeaderboardEntry> currentTop = getTopEntries();
        
        // Save the new entry
        LeaderboardEntry newEntry = new LeaderboardEntry(name, score);
        repository.save(newEntry);
        
        // Only prune if we have more than 5 entries total
        if (currentTop.size() >= 5) {
            // Get all entries sorted by score (desc) and timestamp (asc for tie-breaking)
            List<LeaderboardEntry> allEntries = repository.findAllByOrderByScoreDescTimestampAsc();
            
            // Keep only top 5
            if (allEntries.size() > 5) {
                List<LeaderboardEntry> entriesToDelete = allEntries.subList(5, allEntries.size());
                repository.deleteAll(entriesToDelete);
            }
        }
    }

    public List<LeaderboardEntry> getTopEntries() {
        return repository.findTop5ByOrderByScoreDescTimestampAsc();
    }

    @Transactional
    public void clearLeaderboard() {
        repository.deleteAll();
    }
}