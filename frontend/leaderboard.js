/* eslint-disable no-alert */
// src/leaderboard.js
import { fetchLeaderboard, submitScore } from './api.js';
import authService from './auth.js';

const leaderboardList = document.getElementById('leaderboardList'); // matches index.html
// index.html doesn't define '#leaderboard-error' - we'll render errors into the list instead

let entries = [];
let onChange = null;
let submitting = false;

export async function getEntries() {
  try {
    const data = await fetchLeaderboard();
    entries = Array.isArray(data) ? data.slice().sort((a, b) => b.score - a.score) : [];
    return [...entries];
  } catch (err) {
    // return last-known entries on error
    return [...entries];
  }
}

export async function qualifiesForLeaderboard(score) {
  try {
    const current = await getEntries();
    if (current.length < 10) return true;
    return score > current[current.length - 1].score;
  } catch {
    return true;
  }
}

export function setLeaderboardChangeCallback(callback) {
  onChange = callback;
}

export async function addOrUpdateEntry(name, score) {
  if (submitting) return;
  submitting = true;
  try {
    if (!authService.isAuthenticated()) {
      throw new Error('Not authenticated');
    }
    await submitScore(score);
    const updated = await getEntries();
    entries = updated;
    if (onChange) onChange(entries);
  } finally {
    submitting = false;
  }
}

/**
 * Render leaderboard entries on screen
 */
export async function renderLeaderboard() {
  try {
    const data = await fetchLeaderboard();

    if (!leaderboardList) return;

    leaderboardList.innerHTML = '';

    if (!data || data.length === 0) {
      leaderboardList.innerHTML = '<li>No scores yet!</li>';
      return;
    }

    data
      .sort((a, b) => b.score - a.score)
      .forEach((entry) => {
        const li = document.createElement('li');
        const date = entry.timestamp ? new Date(entry.timestamp).toLocaleString() : '';
        li.textContent = `${entry.name} — ${entry.score}${date ? ` (${date})` : ''}`;
        leaderboardList.appendChild(li);
      });
  } catch (err) {
    if (leaderboardList) {
      leaderboardList.innerHTML = `<li class="error">Error loading leaderboard: ${err.message || ''}</li>`;
    }
  }
}

/**
 * Try submitting the player's score to the backend
 */
export async function handleScoreSubmission(score) {
  try {
    if (!authService.isAuthenticated()) {
      alert('Please log in to submit your score.');
      return;
    }

    await submitScore(score);

    alert('✅ Score submitted!');
    await renderLeaderboard();
  } catch (err) {
    alert(`❌ Failed to submit score: ${err.message || err}`);
  }
}

/**
 * Initialize leaderboard section
 */
export function initLeaderboard() {
  // initial render
  renderLeaderboard();

  const refreshBtn = document.getElementById('refresh-leaderboard');
  if (refreshBtn) refreshBtn.addEventListener('click', renderLeaderboard);
}
