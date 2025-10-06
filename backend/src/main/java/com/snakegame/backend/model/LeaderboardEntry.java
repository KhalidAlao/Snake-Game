package com.snakegame.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "leaderboard_entries")
public class LeaderboardEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private int score;
    private long timestamp; // Add this field

    public LeaderboardEntry() {}

    public LeaderboardEntry(String name, int score) {
        this.name = name;
        this.score = score;
        this.timestamp = System.currentTimeMillis(); // Set timestamp on creation
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
    
    public long getTimestamp() { return timestamp; } // Add getter
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; } // Add setter
}