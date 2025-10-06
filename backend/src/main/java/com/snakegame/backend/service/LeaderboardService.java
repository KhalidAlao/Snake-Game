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
        repository.save(new LeaderboardEntry(name, score));

        // Keep only top 5 scores
        List<LeaderboardEntry> entries = repository.findAll()
                .stream()
                .sorted(Comparator.comparingInt(LeaderboardEntry::getScore).reversed())
                .toList();

        if (entries.size() > 5) {
            List<LeaderboardEntry> toRemove = entries.subList(5, entries.size());
            repository.deleteAll(toRemove);
        }
    }

    public List<LeaderboardEntry> getTopEntries() {
        return repository.findAll()
                .stream()
                .sorted(Comparator.comparingInt(LeaderboardEntry::getScore).reversed())
                .limit(5)
                .toList();
    }

    public void clearLeaderboard() {
        repository.deleteAll();
    }
}
