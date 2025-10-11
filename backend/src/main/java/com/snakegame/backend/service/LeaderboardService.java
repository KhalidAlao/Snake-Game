package com.snakegame.backend.service;

import com.snakegame.backend.model.LeaderboardEntry;
import com.snakegame.backend.repository.LeaderboardRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        long currentTime = System.currentTimeMillis();
        
        // Check for recent duplicate submission (within 5 seconds)
        Optional<LeaderboardEntry> recentDuplicate = repository
            .findTopByNameAndScoreAndTimestampAfterOrderByTimestampDesc(
                name, score, currentTime - 5000);
            
        if (recentDuplicate.isPresent()) {
            System.out.println("⏭️  Skipping duplicate submission: " + name + " - " + score);
            return;
        }
        
        System.out.println("🔄 Processing score: " + name + " - " + score);
        
        // Save the new entry
        LeaderboardEntry newEntry = new LeaderboardEntry(name, score);
        repository.save(newEntry);
        System.out.println("✅ Saved entry with ID: " + newEntry.getId());
        
        // Prune to top 5
        pruneToTop5();
    }

    @Transactional
    public void pruneToTop5() {
        List<LeaderboardEntry> allEntries = repository.findAllByOrderByScoreDescTimestampAsc();
        
        if (allEntries.size() > 5) {
            List<LeaderboardEntry> entriesToDelete = allEntries.subList(5, allEntries.size());
            System.out.println("🗑️  Deleting " + entriesToDelete.size() + " entries");
            repository.deleteAll(entriesToDelete);
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