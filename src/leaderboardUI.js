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

// Hide leaderboard modal
export function hideLeaderboard() {
  modal.classList.add('hidden');
  topScoreInput.classList.add('hidden');
  pendingScore = null;
}

// Render the leaderboard list
export function renderLeaderboard() {
  const entries = getEntries();
  list.innerHTML = entries.length
    ? entries.map((e, i) => `<li>${i + 1}. ${e.name}: ${e.score}</li>`).join('')
    : '<li>No scores yet!</li>';
}

// Initialize modal interactions
export function initLeaderboardUI(onRestart) {
  onRestartCallback = onRestart;

  playAgainBtn.addEventListener('click', () => {
    hideLeaderboard();
    if (onRestartCallback) onRestartCallback();
  });

  closeBtn.addEventListener('click', hideLeaderboard);

  submitNameBtn.addEventListener('click', () => {
    const name = playerNameInput.value.trim();
    if (name && pendingScore != null) {
      addOrUpdateEntry(name, pendingScore);
      pendingScore = null;
      playerNameInput.value = '';
      topScoreInput.classList.add('hidden');
      renderLeaderboard();
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
