/* eslint-disable no-console */
import { fetchLeaderboard, submitScore } from './api.js';

let entries = [];
let onChange = null;

// Fetch initial leaderboard from API when module loads
fetchLeaderboard()
  .then((data) => {
    entries = data;
    if (onChange) onChange(entries);
  })
  .catch((error) => console.error('Failed to load leaderboard:', error));

async function addOrUpdateEntry(name, score) {
  try {
    // Submit score to backend API
    await submitScore(name, score);

    // Fetch updated leaderboard from backend
    const updatedLeaderboard = await fetchLeaderboard();

    // Update local state with data from backend
    entries = updatedLeaderboard;

    // Notify subscribers about the change
    if (onChange) onChange(entries);
  } catch (error) {
    console.error('Error in addOrUpdateEntry:', error);
    throw error; // Re-throw to let caller handle the error
  }
}

async function getEntries() {
  try {
    // Always fetch fresh data from API to ensure we have latest state
    entries = await fetchLeaderboard();
    return [...entries];
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [...entries]; // Return cached entries as fallback
  }
}

function qualifiesForLeaderboard(score) {
  const current = entries; // Use current cached entries
  return current.length < 5 || score > current[current.length - 1]?.score;
}

function setLeaderboardChangeCallback(cb) {
  onChange = cb;
}

export { addOrUpdateEntry, getEntries, qualifiesForLeaderboard, setLeaderboardChangeCallback };
