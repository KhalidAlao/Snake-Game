package com.snakegame.backend.repository;

import com.snakegame.backend.model.LeaderboardEntry;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@Repository
@Primary // Default bean if multiple implementations exist
public class InMemoryLeaderboardRepository implements LeaderboardRepository {

    private final List<LeaderboardEntry> entries = new ArrayList<>();
    private final AtomicLong idCounter = new AtomicLong(1);

    @Override
    public LeaderboardEntry save(LeaderboardEntry entry) {
        if (entry.getId() == null) {
            entry.setId(idCounter.getAndIncrement());
        }
        entries.add(entry);
        return entry;
    }

    @Override
    public List<LeaderboardEntry> findAll() {
        return new ArrayList<>(entries);
    }

    @Override
    public void clear() {
        entries.clear();
        idCounter.set(1);
    }
}
