package com.snakegame.backend.repository;

import com.snakegame.backend.model.LeaderboardEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;


@Repository
public interface LeaderboardRepository extends JpaRepository<LeaderboardEntry, Long> {
    
    // Custom method to clear all entries
    @Modifying
    @Transactional
    @Query("DELETE FROM LeaderboardEntry")
    void clear();
    
}