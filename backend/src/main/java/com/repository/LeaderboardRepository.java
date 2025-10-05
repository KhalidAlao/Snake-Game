package com.repository;

import com.model.LeaderboardEntry;
import java.util.List;

public interface LeaderboardRepository {
    LeaderboardEntry save(LeaderboardEntry entry); // store a new entry
    List<LeaderboardEntry> findAll();              // retrieve all entries
    void clear();                                  // clear all entries
}
