package com.repository;

import com.model.LeaderboardEntry;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Repository;

@Repository
public class LeaderboardRepository {
    private final List<LeaderboardEntry> entries = new ArrayList<>();

    public List<LeaderboardEntry> findAll() {
        return Collections.unmodifiableList(entries);
    }

    public void save(LeaderboardEntry entry) {
        entries.add(entry);
    }

    public void clear() {
        entries.clear();
    }
}
