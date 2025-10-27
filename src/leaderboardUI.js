// src/leaderboardUI.js
import authService from './auth.js';
import { fetchLeaderboard, submitScore } from './api.js';

/* DOM references */
const modal = document.getElementById('modal');
const listEl = document.getElementById('leaderboardList');
const topScoreInput = document.getElementById('topScoreInput');
const submitNameBtn = document.getElementById('submitName');
const playAgainBtn = document.getElementById('restart-game');
const closeBtn = document.getElementById('closeLeaderboard');

let isLoading = false;
let submissionLock = null;
let pendingScore = null;

function setLoading(loading) {
  isLoading = loading;
  if (submitNameBtn) {
    submitNameBtn.disabled = loading;
    submitNameBtn.textContent = loading ? 'Submitting...' : 'Submit';
  }
  if (listEl && loading) {
    listEl.innerHTML = '<li>Loading...</li>';
  }
}

function formatTimestamp(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleString();
}

function renderLeaderboardList(entries) {
  if (!listEl) return;
  if (!entries || !Array.isArray(entries)) {
    listEl.innerHTML = '<li class="error">Invalid leaderboard data</li>';
    return;
  }

  listEl.innerHTML = entries.length
    ? entries
        .map((e, i) => {
          const tsHtml = e.timestamp
            ? ` <small class="timestamp">(${formatTimestamp(e.timestamp)})</small>`
            : '';
          // use entry.name (backend sets it from JWT)
          return `<li>${i + 1}. ${e.name}: ${e.score}${tsHtml}</li>`;
        })
        .join('')
    : '<li>No scores yet! Be the first!</li>';
}

function showError(message) {
  if (!listEl) return;
  listEl.innerHTML = `<li class="error">${message}</li>`;
}

async function fetchAndRenderLeaderboard() {
  try {
    setLoading(true);
    const entries = await fetchLeaderboard();
    renderLeaderboardList(entries);
  } catch (err) {
    showError('Failed to load leaderboard. Please try again.');
  } finally {
    setLoading(false);
  }
}

/**
 * Show leaderboard modal
 */
export async function showLeaderboard() {
  if (!modal) return;
  topScoreInput.classList.add('hidden'); // hide name prompt
  modal.classList.remove('hidden');
  await fetchAndRenderLeaderboard();
}

/**
 * Hide modal
 */
export function hideLeaderboard() {
  if (!modal) return;
  modal.classList.add('hidden');
  pendingScore = null;
  submissionLock = null;
}

/**
 * Called by the game when player finishes and qualifies.
 * This function now requires the user to be logged in and will submit the score directly.
 * Returns username on success, or null if not submitted.
 */
export async function promptTopScore(score) {
  // prevent concurrent prompts
  if (submissionLock) return null;

  // must be logged in
  if (!authService.isAuthenticated()) {
    // show leaderboard and instruct user to log in
    await showLeaderboard();
    showError('You must be logged in to submit a score. Use the Login button in the header.');
    return null;
  }

  // lock and submit
  submissionLock = Symbol('submission');
  pendingScore = score;
  setLoading(true);

  try {
    await submitScore(pendingScore);
    // refresh and close
    await fetchAndRenderLeaderboard();
    submissionLock = null;
    pendingScore = null;
    return authService.username || null;
  } catch (err) {
    showError('Failed to submit score. Please try again.');
    submissionLock = null;
    pendingScore = null;
    throw err;
  } finally {
    setLoading(false);
  }
}

/* Init UI bindings */
export function initLeaderboardUI(onRestart) {
  if (playAgainBtn) {
    playAgainBtn.addEventListener('click', () => {
      hideLeaderboard();
      if (typeof onRestart === 'function') onRestart();
    });
  }
  if (closeBtn) closeBtn.addEventListener('click', hideLeaderboard);

  // In case submit button exists, wire it to submit current pendingScore (for manual use).
  if (submitNameBtn) {
    submitNameBtn.addEventListener('click', async () => {
      if (pendingScore == null) return;
      try {
        await promptTopScore(pendingScore);
      } catch {
        // error handled in promptTopScore
      }
    });
  }

  // initial render
  fetchAndRenderLeaderboard();
}
