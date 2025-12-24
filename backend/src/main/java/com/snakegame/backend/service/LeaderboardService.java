package com.snakegame.backend.service;

import com.snakegame.backend.model.LeaderboardEntry;
import com.snakegame.backend.repository.LeaderboardRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class LeaderboardService {
    private final LeaderboardRepository repository;

    public LeaderboardService(LeaderboardRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public void addEntry(String name, int score) {
        long now = System.currentTimeMillis();
        Optional<LeaderboardEntry> dup = repository.findTopByNameAndScoreAndTimestampAfterOrderByTimestampDesc(name, score, now - 5000);
        if (dup.isPresent()) return;
        LeaderboardEntry entry = new LeaderboardEntry(name, score);
        repository.save(entry);
        pruneToTop5();
    }

    @Transactional
    public void pruneToTop5() {
        List<LeaderboardEntry> all = repository.findAllByOrderByScoreDescTimestampAsc();
        if (all.size() > 5) {
            List<LeaderboardEntry> del = new ArrayList<>(all.subList(5, all.size())); // Create a new ArrayList
            repository.deleteAll(del);
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