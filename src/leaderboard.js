/* eslint-disable no-console */
import { fetchLeaderboard, submitScore } from './api.js';

let entries = [];
let onChange = null;
let submitting = false;

// Fetch latest leaderboard from backend
export async function getEntries() {
  try {
    const data = await fetchLeaderboard();
    entries = data.sort((a, b) => b.score - a.score); // sort descending
    return [...entries];
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    return [...entries]; // fallback to cached
  }
}

// Add or update an entry
export async function addOrUpdateEntry(name, score) {
  if (submitting) return; // prevent duplicate calls
  submitting = true;

  try {
    await submitScore(name, score);
    const updatedEntries = await getEntries();
    entries = updatedEntries;
    if (onChange) onChange(entries);
  } catch (err) {
    console.error('Failed to submit score:', err);
    throw err;
  } finally {
    submitting = false;
  }
}

// Check if score qualifies for top 5
export function qualifiesForLeaderboard(score) {
  return entries.length < 5 || score > entries[entries.length - 1]?.score;
}

// Callback for leaderboard updates
export function setLeaderboardChangeCallback(cb) {
  onChange = cb;
}
