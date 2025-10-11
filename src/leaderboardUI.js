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
let isLoading = false;

function setLoading(loading) {
  isLoading = loading;
  if (loading) {
    submitNameBtn.disabled = true;
    submitNameBtn.textContent = 'Submitting...';
    list.innerHTML = '<li>Loading...</li>';
  } else {
    submitNameBtn.disabled = false;
    submitNameBtn.textContent = 'Submit';
  }
}

function showError(message) {
  list.innerHTML = `<li class="error">${message}</li>`;
  setTimeout(() => renderLeaderboard(), 3000);
}

function formatTimestamp(ts) {
  if (!ts) return '';
  const date = new Date(ts);
  return date.toLocaleString();
}

// Render leaderboard list
export async function renderLeaderboard() {
  try {
    setLoading(true);
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
      : '<li>No scores yet! Be the first!</li>';
  } catch (error) {
    console.error('Error rendering leaderboard:', error);
    showError('Failed to load leaderboard. Please try again.');
  } finally {
    setLoading(false);
  }
}

// Hide modal
export function hideLeaderboard() {
  modal.classList.add('hidden');
  topScoreInput.classList.add('hidden');
  pendingScore = null;
  playerNameInput.value = '';
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
    const handleSubmit = async () => {
      const name = playerNameInput.value.trim();
      if (!name || isLoading) return;
      
      try {
        setLoading(true);
        await addOrUpdateEntry(name, pendingScore);
        pendingScore = null;
        playerNameInput.value = '';
        topScoreInput.classList.add('hidden');
        await renderLeaderboard();
        resolve(name);
      } catch (err) {
        console.error('Error submitting score:', err);
        showError('Failed to submit score. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    submitNameBtn.onclick = handleSubmit;

    // submit on Enter
    playerNameInput.onkeyup = (e) => {
      if (e.key === 'Enter') handleSubmit();
    };
    
    // Focus the input
    playerNameInput.focus();
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