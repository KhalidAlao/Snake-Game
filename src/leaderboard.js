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
    await submitScore(name, score);

    // Wait a bit to ensure backend processed the request
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });

    const updatedLeaderboard = await fetchLeaderboard();
    entries = updatedLeaderboard;

    if (onChange) onChange(entries);
  } catch (error) {
    console.error('Error in addOrUpdateEntry:', error);
    throw error;
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
