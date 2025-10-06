package com.snakegame.backend.service;

import com.snakegame.backend.model.LeaderboardEntry;
import com.snakegame.backend.repository.LeaderboardRepository;
import org.springframework.stereotype.Service;
import java.util.Comparator;
import java.util.List;


@Service
public class LeaderboardService {

    private final LeaderboardRepository repository;

    public LeaderboardService(LeaderboardRepository repository) {
        this.repository = repository;
    }

    public void addEntry(String name, int score) {
        LeaderboardEntry newEntry = new LeaderboardEntry(name, score);
        repository.save(newEntry);

        // Get all entries and sort them
        List<LeaderboardEntry> entries = repository.findAll();
        entries.sort(Comparator.comparingInt(LeaderboardEntry::getScore).reversed());

        // Remove excess entries beyond top 5 from the repository
        if (entries.size() > 5) {
            // Clear the entire repository
            repository.clear();
            
            // Save only the top 5 entries back
            for (int i = 0; i < 5; i++) {
                repository.save(entries.get(i));
            }
        }
    }

    public List<LeaderboardEntry> getTopEntries() {
        List<LeaderboardEntry> entries = repository.findAll();
        entries.sort(Comparator.comparingInt(LeaderboardEntry::getScore).reversed());
        return entries.stream().limit(5).toList();
    }

    public void clearLeaderboard() {
        repository.clear();
    }
}