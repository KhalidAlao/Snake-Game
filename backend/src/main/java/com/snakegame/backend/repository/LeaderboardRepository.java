package com.snakegame.backend.repository;

import com.snakegame.backend.model.LeaderboardEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeaderboardRepository extends JpaRepository<LeaderboardEntry, Long> {
    
    List<LeaderboardEntry> findAllByOrderByScoreDescTimestampAsc();
    List<LeaderboardEntry> findTop5ByOrderByScoreDescTimestampAsc();
    
    // Check for duplicate submissions within a time window
    @Query("SELECT e FROM LeaderboardEntry e WHERE e.name = :name AND e.score = :score AND e.timestamp > :minTimestamp ORDER BY e.timestamp DESC")
    Optional<LeaderboardEntry> findTopByNameAndScoreAndTimestampAfterOrderByTimestampDesc(
        @Param("name") String name, 
        @Param("score") int score, 
        @Param("minTimestamp") long minTimestamp);
}