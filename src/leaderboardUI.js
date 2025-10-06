import { getEntries, addOrUpdateEntry, qualifiesForLeaderboard } from './leaderboard.js';

const modal = document.getElementById('modal');
const list = document.getElementById('leaderboardList');
const topScoreInput = document.getElementById('topScoreInput');
const playerNameInput = document.getElementById('playerName');
const submitNameBtn = document.getElementById('submitName');
const playAgainBtn = document.getElementById('restart-game');
const closeBtn = document.getElementById('closeLeaderboard');

let pendingScore = null;
let onRestartCallback = null;

function formatTimestamp(ts) {
  if (!ts) return '';
  const date = new Date(ts);
  return date.toLocaleString();
}

// Render leaderboard list
export async function renderLeaderboard() {
  try {
    const entries = await getEntries();
    list.innerHTML = entries.length
      ? entries
          .map((e, i) => {
            const tsHtml = e.timestamp
              ? ` <small class="timestamp">(${formatTimestamp(e.timestamp)})</small>`
              : '';
            return `<li>${i + 1}. ${e.name}: ${e.score}${tsHtml}</li>`;
          })
          .join('')
      : '<li>No scores yet!</li>';
  } catch {
    list.innerHTML = '<li>Error loading leaderboard</li>';
  }
}

// Hide modal
export function hideLeaderboard() {
  modal.classList.add('hidden');
  topScoreInput.classList.add('hidden');
  pendingScore = null;
}

// Show leaderboard modal
export async function showLeaderboard() {
  topScoreInput.classList.add('hidden');
  modal.classList.remove('hidden');
  await renderLeaderboard();
}

// Show modal and prompt for name
export async function promptTopScore(score) {
  if (!qualifiesForLeaderboard(score)) {
    showLeaderboard();
    return null;
  }

  pendingScore = score;
  topScoreInput.classList.remove('hidden');
  modal.classList.remove('hidden');
  await renderLeaderboard();

  return new Promise((resolve) => {
    submitNameBtn.onclick = async () => {
      const name = playerNameInput.value.trim();
      if (!name) return;
      try {
        await addOrUpdateEntry(name, pendingScore);
        pendingScore = null;
        playerNameInput.value = '';
        topScoreInput.classList.add('hidden');
        await renderLeaderboard();
        resolve(name);
      } catch (err) {
        // eslint-disable-next-line no-alert
        alert('Failed to submit score. Please try again.');
      }
    };

    // submit on Enter
    playerNameInput.onkeyup = (e) => {
      if (e.key === 'Enter') submitNameBtn.click();
    };
  });
}

// Initialize modal actions
export function initLeaderboardUI(onRestart) {
  onRestartCallback = onRestart;

  playAgainBtn.addEventListener('click', () => {
    hideLeaderboard();
    if (onRestartCallback) onRestartCallback();
  });

  closeBtn.addEventListener('click', hideLeaderboard);
  renderLeaderboard();
}
