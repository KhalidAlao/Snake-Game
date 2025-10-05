package com.snakegame.backend.model;

public class LeaderboardEntry {

    private Long id; // for future database use
    private String name;
    private int score;

    public LeaderboardEntry() {}

    public LeaderboardEntry(String name, int score) {
        this.name = name;
        this.score = score;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }
}
