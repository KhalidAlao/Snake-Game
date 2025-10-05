package com.service;

import com.model.LeaderboardEntry;
import com.repository.LeaderboardRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaderboardService {
  private final LeaderboardRepository repository;

  public LeaderboardService(LeaderboardRepository repository) {
    this.repository = repository;
  }

  /**
   * Returns entries sorted by score descending (highest first).
   */
  public List<LeaderboardEntry> getLeaderboard() {
    return repository.findAll().stream()
      // use explicit lambda comparator to avoid method-ref ambiguity
      .sorted((a, b) -> Integer.compare(b.getScore(), a.getScore()))
      .collect(Collectors.toList());
  }

  /**
   * Add a new entry. Validate input.
   */
  public void addEntry(String name, int score) {
    if (name == null || name.isBlank()) {
      throw new IllegalArgumentException("Name cannot be blank");
    }
    if (score < 0) {
      throw new IllegalArgumentException("Score cannot be negative");
    }
    repository.save(new LeaderboardEntry(name, score));
  }

  public void clearLeaderboard() {
    repository.clear();
  }
}
