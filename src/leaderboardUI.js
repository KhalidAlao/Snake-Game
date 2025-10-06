/* eslint-disable no-alert */
import { getEntries, addOrUpdateEntry, qualifiesForLeaderboard } from './leaderboard.js';

const modal = document.getElementById('modal');
const list = document.getElementById('leaderboardList');
const topScoreInput = document.getElementById('topScoreInput');
const playerNameInput = document.getElementById('playerName');
const submitNameBtn = document.getElementById('submitName');
const playAgainBtn = document.getElementById('restart-game');
const closeBtn = document.getElementById('closeLeaderboard');

let onRestartCallback = null;
let pendingScore = null; // Holds score waiting for name input

function formatTimestamp(ts) {
  if (!ts && ts !== 0) return '';
  // If backend returned an ISO string, Date handles it too
  const date = new Date(ts);
  // Use locale-specific date/time; adjust options if you want different format
  return date.toLocaleString();
}

// Hide leaderboard modal
export function hideLeaderboard() {
  modal.classList.add('hidden');
  topScoreInput.classList.add('hidden');
  pendingScore = null;
}

// Render the leaderboard list
export async function renderLeaderboard() {
  try {
    const entriesArr = await getEntries();
    list.innerHTML = entriesArr.length
      ? entriesArr
          .map((e, i) => {
            const tsHtml = e.timestamp
              ? ` <small class="timestamp">(${formatTimestamp(e.timestamp)})</small>`
              : '';
            return `<li>${i + 1}. ${e.name}: ${e.score}${tsHtml}</li>`;
          })
          .join('')
      : '<li>No scores yet!</li>';
  } catch (err) {
    list.innerHTML = '<li>Error loading leaderboard</li>';
  }
}

// Initialize modal interactions
export function initLeaderboardUI(onRestart) {
  onRestartCallback = onRestart;

  playAgainBtn.addEventListener('click', () => {
    hideLeaderboard();
    if (onRestartCallback) onRestartCallback();
  });

  closeBtn.addEventListener('click', hideLeaderboard);

  submitNameBtn.addEventListener('click', async () => {
    const name = playerNameInput.value.trim();
    if (name && pendingScore != null) {
      try {
        await addOrUpdateEntry(name, pendingScore); // Make sure to await
        pendingScore = null;
        playerNameInput.value = '';
        topScoreInput.classList.add('hidden');
        await renderLeaderboard(); // Also make renderLeaderboard async
      } catch (error) {
        alert('Failed to submit score. Please try again.');
      }
    }
  });

  // submit on Enter key
  playerNameInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') submitNameBtn.click();
  });

  renderLeaderboard();
}

// Show leaderboard modal normally
export function showLeaderboard() {
  topScoreInput.classList.add('hidden');
  modal.classList.remove('hidden');
  renderLeaderboard();
}

// Show leaderboard modal when a new top score occurs
export function promptTopScore(score) {
  if (!qualifiesForLeaderboard(score)) {
    showLeaderboard();
    return;
  }

  pendingScore = score;
  topScoreInput.classList.remove('hidden');
  modal.classList.remove('hidden');
  renderLeaderboard();
}
