package com.snakegame.backend.repository;

import com.snakegame.backend.model.LeaderboardEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface LeaderboardRepository extends JpaRepository<LeaderboardEntry, Long> {
    
    // Get top 5 entries ordered by score (desc) and timestamp (asc for tie-breaking)
    List<LeaderboardEntry> findTop5ByOrderByScoreDescTimestampAsc();
    
    // Get all entries ordered for pruning
    List<LeaderboardEntry> findAllByOrderByScoreDescTimestampAsc();
    
    // Custom method to clear all entries
    @Modifying
    @Transactional
    @Query("DELETE FROM LeaderboardEntry")
    void clear();
}