package com.service;

import com.model.LeaderboardEntry;
import com.repository.LeaderboardRepository;

import java.util.Comparator;
import java.util.List;

public class LeaderboardService {

    private final LeaderboardRepository repository;

    public LeaderboardService(LeaderboardRepository repository) {
        this.repository = repository;
    }

    public void addEntry(String name, int score) {
        LeaderboardEntry newEntry = new LeaderboardEntry(name, score);
        repository.save(newEntry);
    
        // Fetch all entries and sort descending
        List<LeaderboardEntry> entries = repository.findAll();
        entries.sort(Comparator.comparingInt(LeaderboardEntry::getScore).reversed());
    
        // Keep only top 5
        if (entries.size() > 5) {
            entries.subList(5, entries.size()).clear();
        }
    }

    public List<LeaderboardEntry> getTopEntries() {
        List<LeaderboardEntry> entries = repository.findAll();
        entries.sort(Comparator.comparingInt(LeaderboardEntry::getScore).reversed());
        if (entries.size() > 5) {
            entries = entries.subList(0, 5);
        }
        return entries;
    }
    
    public void clearLeaderboard() {
        repository.clear();
    }
    
}
