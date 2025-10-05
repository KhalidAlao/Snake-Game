package com.model;

import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Simple POJO representing one leaderboard entry.
 * Kept intentionally plain (no JPA annotations) for in-memory repo.
 */
public class LeaderboardEntry {
  private Long id; // optional placeholder for future DB migration
  private String name;
  private int score;
  private LocalDateTime createdAt;

  // No-arg constructor (useful for frameworks & tests)
  public LeaderboardEntry() { }

  // Public convenience constructor used by service/repository
  public LeaderboardEntry(String name, int score) {
    this.name = name;
    this.score = score;
    this.createdAt = LocalDateTime.now();
  }

  // Getters (note: getScore returns primitive int)
  public Long getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public int getScore() {
    return score;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  // Setters (optional; useful for tests or future JPA)
  public void setId(Long id) {
    this.id = id;
  }

  public void setName(String name) {
    this.name = name;
  }

  public void setScore(int score) {
    this.score = score;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof LeaderboardEntry)) return false;
    LeaderboardEntry that = (LeaderboardEntry) o;
    return score == that.score &&
      Objects.equals(id, that.id) &&
      Objects.equals(name, that.name) &&
      Objects.equals(createdAt, that.createdAt);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, name, score, createdAt);
  }

  @Override
  public String toString() {
    return "LeaderboardEntry{" +
      "id=" + id +
      ", name='" + name + '\'' +
      ", score=" + score +
      ", createdAt=" + createdAt +
      '}';
  }
}
