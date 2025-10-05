package com.snakegame.backend.repository;

import com.snakegame.backend.model.LeaderboardEntry;
import java.util.List;

public interface LeaderboardRepository {
    LeaderboardEntry save(LeaderboardEntry entry);
    List<LeaderboardEntry> findAll();
    void clear();
}
