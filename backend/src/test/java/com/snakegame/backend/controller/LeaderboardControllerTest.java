package com.snakegame.backend.controller;

import com.snakegame.backend.BackendApplication;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest(classes = BackendApplication.class)
public class LeaderboardControllerTest {

    @Autowired
    private LeaderboardController leaderboardController;

    @Test
    public void testContextLoads() {
        assertNotNull(leaderboardController);
    }
}