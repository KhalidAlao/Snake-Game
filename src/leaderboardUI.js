import { getEntries, addOrUpdateEntry, qualifiesForLeaderboard } from './leaderboard.js';

let modal;
let list;
let topScoreInput;
let playerNameInput;
let submitNameBtn;
let playAgainBtn;
let closeBtn;

let pendingScore = null;
let onRestartCallback = null;
let isLoading = false;
let isSubmitting = false;
let submissionLock = null;

function setLoading(loading) {
  isLoading = loading;
  if (!submitNameBtn || !list) return;
  if (loading) {
    submitNameBtn.disabled = true;
    submitNameBtn.textContent = 'Submitting...';
    list.innerHTML = '<li>Loading...</li>';
  } else {
    submitNameBtn.disabled = false;
    submitNameBtn.textContent = 'Submit';
  }
}

function formatTimestamp(ts) {
  if (!ts) return '';
  const date = new Date(ts);
  return date.toLocaleString();
}

function renderLeaderboardList(entries) {
  if (!list) return;
  if (!entries || !Array.isArray(entries)) {
    list.innerHTML = '<li class="error">Invalid leaderboard data</li>';
    return;
  }

  list.innerHTML = entries.length
    ? entries
        .map((e, i) => {
          const tsHtml = e.timestamp
            ? ` <small class="timestamp">(${formatTimestamp(e.timestamp)})</small>`
            : '';
          return `<li>${i + 1}. ${e.name}: ${e.score}${tsHtml}</li>`;
        })
        .join('')
    : '<li>No scores yet! Be the first!</li>';
}

function showError(message) {
  if (!list) return;
  list.innerHTML = `<li class="error">${message}</li>`;
}

async function fetchAndRenderLeaderboard() {
  try {
    setLoading(true);
    const entries = await getEntries();
    renderLeaderboardList(entries);
  } catch (error) {
    showError('Failed to load leaderboard. Please try again.');
  } finally {
    setLoading(false);
  }
}

export async function renderLeaderboard() {
  await fetchAndRenderLeaderboard();
}

export function hideLeaderboard() {
  if (!modal || !topScoreInput || !playerNameInput) return;
  modal.classList.add('hidden');
  topScoreInput.classList.add('hidden');
  pendingScore = null;
  submissionLock = null;
  playerNameInput.value = '';
}

export async function showLeaderboard() {
  if (!modal || !topScoreInput) return;
  topScoreInput.classList.add('hidden');
  modal.classList.remove('hidden');
  await fetchAndRenderLeaderboard();
}

export async function promptTopScore(score) {
  // prevent concurrent prompts
  if (submissionLock) return null;
  if (!qualifiesForLeaderboard(score)) {
    await showLeaderboard();
    return null;
  }

  submissionLock = Symbol('submission');
  pendingScore = score;
  topScoreInput.classList.remove('hidden');
  modal.classList.remove('hidden');

  await fetchAndRenderLeaderboard();

  return new Promise((resolve) => {
    const handleSubmit = async () => {
      const name = playerNameInput.value.trim();
      if (!name || isLoading || isSubmitting) return;

      // ensure our lock is still active
      if (submissionLock === null) return;

      try {
        isSubmitting = true;
        setLoading(true);
        await addOrUpdateEntry(name, pendingScore);

        // clear submission state
        pendingScore = null;
        submissionLock = null;

        playerNameInput.value = '';
        topScoreInput.classList.add('hidden');
        await fetchAndRenderLeaderboard();
        resolve(name);
      } catch (err) {
        showError('Failed to submit score. Please try again.');
      } finally {
        setLoading(false);
        isSubmitting = false;
      }
    };

    // reset handler to avoid duplicate listeners
    submitNameBtn.replaceWith(submitNameBtn.cloneNode(true));
    submitNameBtn = document.getElementById('submitName');
    submitNameBtn.addEventListener('click', handleSubmit);

    playerNameInput.onkeyup = (e) => {
      if (e.key === 'Enter') handleSubmit();
    };

    playerNameInput.focus();
  });
}

export function resetSubmissionState() {
  submissionLock = null;
  isSubmitting = false;
  pendingScore = null;
}

export function initLeaderboardUI(onRestart) {
  // DOM references here (safe to call from DOMContentLoaded)
  modal = document.getElementById('modal');
  list = document.getElementById('leaderboardList');
  topScoreInput = document.getElementById('topScoreInput');
  playerNameInput = document.getElementById('playerName');
  submitNameBtn = document.getElementById('submitName');
  playAgainBtn = document.getElementById('restart-game');
  closeBtn = document.getElementById('closeLeaderboard');

  onRestartCallback = onRestart;

  if (playAgainBtn) {
    playAgainBtn.addEventListener('click', () => {
      hideLeaderboard();
      if (onRestartCallback) onRestartCallback();
    });
  }
  if (closeBtn) closeBtn.addEventListener('click', hideLeaderboard);

  fetchAndRenderLeaderboard();
}
