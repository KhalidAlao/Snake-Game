import {
  initGame,
  step,
  changeDirection,
  getSnake,
  getFood,
  isGameRunning,
  isPaused,
  togglePause,
  setDimensions,
} from './logic.js';
import { clearCanvas, drawSnake, drawFood } from './renderer.js';
import {
  getEntries,
  addOrUpdateEntry,
  qualifiesForLeaderboard,
  setLeaderboardChangeCallback,
} from './leaderboard.js';
import { showLeaderboard, initLeaderboardUI, promptTopScore } from './leaderboardUI.js';
import { initInput, getInputDirection, resetDirection } from './input.js';
import { initAuthUI, tryAutoLogin } from './authUI.js';
import authService from './auth.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartBtn = document.getElementById('restart-game');

let score = 0;
let accumulator = 0;
let moveInterval = 200;
let lastTime = null;
let currentHighScore = 0;
let isNewHighScore = false;

// Initialize canvas size
function resize() {
  canvas.width = Math.floor((window.innerWidth * 0.8) / 20) * 20;
  canvas.height = Math.floor((window.innerHeight * 0.6) / 20) * 20;
  setDimensions(canvas.width, canvas.height);
}
window.addEventListener('resize', resize);

// Update score display and check high score
function updateScore(currentScore) {
  document.getElementById('score').textContent = `Score: ${currentScore}`;
  if (currentScore > currentHighScore) {
    isNewHighScore = true;
    currentHighScore = currentScore;
    document.getElementById('high-score').textContent = `High Score: ${currentHighScore}`;
  }
}

// Initialize high score from backend
async function initHighScore() {
  const entries = await getEntries();
  if (entries.length > 0) {
    currentHighScore = entries[0].score;
    document.getElementById('high-score').textContent = `High Score: ${currentHighScore}`;
  }
}

// Handle game over and leaderboard submission
async function handleGameOver() {
  if (isNewHighScore || qualifiesForLeaderboard(score)) {
    try {
      const playerName = await promptTopScore(score);
      if (playerName) {
        await addOrUpdateEntry(playerName, score);
        const updatedEntries = await getEntries();
        if (updatedEntries.length > 0) {
          currentHighScore = updatedEntries[0].score;
          document.getElementById('high-score').textContent = `High Score: ${currentHighScore}`;
        }
      }
    } catch (err) {
      showLeaderboard();
    }
  } else {
    showLeaderboard();
  }
  isNewHighScore = false;
}

// Start or restart game
function startGame() {
  initGame();
  resetDirection(); // Reset input direction on restart
  score = 0;
  accumulator = 0;
  moveInterval = 200;
  isNewHighScore = false;
  updateScore(0);

  // Remove pause overlay if it exists
  const overlay = document.getElementById('pauseOverlay');
  if (overlay) overlay.remove();
}

// Add pause indicator
function drawPauseOverlay() {
  if (isPaused()) {
    let overlay = document.getElementById('pauseOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'pause-overlay';
      overlay.textContent = 'PAUSED - Press P to Resume';
      overlay.id = 'pauseOverlay';
      document.querySelector('.canvas-wrapper').appendChild(overlay);
    }
  } else {
    const overlay = document.getElementById('pauseOverlay');
    if (overlay) overlay.remove();
  }
}

// Main game loop
function mainLoop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const delta = timestamp - lastTime;
  lastTime = timestamp;

  if (isGameRunning()) {
    if (!isPaused()) {
      // Get current direction from input system and update game logic
      const direction = getInputDirection();

      accumulator += delta;
      while (accumulator >= moveInterval) {
        accumulator -= moveInterval;

        // Update direction before each step
        changeDirection(direction);

        const ate = step();
        if (ate) {
          score += 5;
          updateScore(score);
          if (score % 50 === 0) moveInterval = Math.max(50, moveInterval - 20);
        }
        if (!isGameRunning()) {
          handleGameOver();
          break;
        }
      }
    }
    drawPauseOverlay();
  }

  clearCanvas(ctx, canvas);
  drawSnake(ctx, getSnake());
  drawFood(ctx, getFood());

  requestAnimationFrame(mainLoop);
}

// Input handling
function initInputHandling() {
  // Initialize input system with pause callback
  initInput(togglePause);

  // Restart buttons
  restartBtn?.addEventListener('click', startGame);
  document.getElementById('restart-btn')?.addEventListener('click', startGame);
}

// Theme handling
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeLabel = document.getElementById('theme-label');

  if (themeToggle && themeLabel) {
    themeToggle.addEventListener('click', () => {
      const html = document.documentElement;
      const newTheme = html.dataset.theme === 'dark' ? 'light' : 'dark';
      html.dataset.theme = newTheme;
      themeLabel.textContent = newTheme === 'dark' ? 'Dark Mode' : 'Light Mode';
      localStorage.setItem('snakeTheme', newTheme);
    });

    // Load saved theme
    const saved = localStorage.getItem('snakeTheme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
      themeLabel.textContent = saved === 'dark' ? 'Dark Mode' : 'Light Mode';
    }
  }
}

// Help system
function initHelpSystem() {
  const helpBtn = document.getElementById('help-btn');
  const helpModal = document.getElementById('helpModal');
  const closeHelp = document.getElementById('closeHelp');

  if (helpBtn && helpModal && closeHelp) {
    helpBtn.addEventListener('click', () => {
      helpModal.classList.remove('hidden');
    });

    closeHelp.addEventListener('click', () => {
      helpModal.classList.add('hidden');
    });
  }
}

// Update high score live when backend leaderboard changes
setLeaderboardChangeCallback((updatedEntries) => {
  if (updatedEntries.length > 0 && updatedEntries[0].score > currentHighScore) {
    currentHighScore = updatedEntries[0].score;
    document.getElementById('high-score').textContent = `High Score: ${currentHighScore}`;
  }
});

// Initialize everything
function init() {
  initInputHandling();
  initTheme();
  initHelpSystem();
  initAuthUI(); 
  tryAutoLogin();
  initLeaderboardUI(startGame);
  resize();
  initHighScore();
  startGame();
  requestAnimationFrame(mainLoop);
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
