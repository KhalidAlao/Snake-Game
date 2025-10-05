package com.repository;

import com.model.LeaderboardEntry;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

public class InMemoryLeaderboardRepository implements LeaderboardRepository {

    private final List<LeaderboardEntry> entries = new ArrayList<>();
    private final AtomicLong idCounter = new AtomicLong(1); // auto-increment IDs

    @Override
    public LeaderboardEntry save(LeaderboardEntry entry) {
        if (entry.getId() == null) {
            entry.setId(idCounter.getAndIncrement()); // assign a unique ID
        }
        entries.add(entry);
        return entry; // optional but conventional
    }

    @Override
    public List<LeaderboardEntry> findAll() {
        return new ArrayList<>(entries); // return a copy to avoid external modification
    }

    @Override
    public void clear() {
        entries.clear();
        idCounter.set(1); // reset ID counter if needed
    }
}
