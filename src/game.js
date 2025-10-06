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
      const playerName = await promptTopScore(score); // wait for name input
      if (playerName) {
        await addOrUpdateEntry(playerName, score); // submit to backend
        const updatedEntries = await getEntries(); // fetch updated leaderboard
        if (updatedEntries.length > 0) {
          currentHighScore = updatedEntries[0].score;
          document.getElementById('high-score').textContent = `High Score: ${currentHighScore}`;
        }
      }
      // eslint-disable-next-line no-empty
    } catch (err) {}
  } else {
    showLeaderboard();
  }
  isNewHighScore = false;
}

// Start or restart game
function startGame() {
  initGame();
  score = 0;
  accumulator = 0;
  moveInterval = 200;
  isNewHighScore = false;
  updateScore(0);
}

// Main game loop
function mainLoop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const delta = timestamp - lastTime;
  lastTime = timestamp;

  if (isGameRunning() && !isPaused()) {
    accumulator += delta;
    while (accumulator >= moveInterval) {
      accumulator -= moveInterval;
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

  clearCanvas(ctx, canvas);
  drawSnake(ctx, getSnake());
  drawFood(ctx, getFood());

  requestAnimationFrame(mainLoop);
}

// Input handling
window.addEventListener('keydown', (e) => {
  if (e.key === 'p' || e.key === 'P') togglePause();
  else changeDirection(e.keyCode || e.key);
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
});

document.getElementById('up-btn').addEventListener('click', () => changeDirection('ArrowUp'));
document.getElementById('down-btn').addEventListener('click', () => changeDirection('ArrowDown'));
document.getElementById('left-btn').addEventListener('click', () => changeDirection('ArrowLeft'));
document.getElementById('right-btn').addEventListener('click', () => changeDirection('ArrowRight'));
restartBtn.addEventListener('click', startGame);
document.getElementById('restart-btn').addEventListener('click', startGame);

// Dark/Light Mode toggle
const themeToggle = document.getElementById('theme-toggle');
const themeLabel = document.getElementById('theme-label');
themeToggle.addEventListener('click', () => {
  const html = document.documentElement;
  html.dataset.theme = html.dataset.theme === 'dark' ? 'light' : 'dark';
  themeLabel.textContent = html.dataset.theme === 'dark' ? 'Dark Mode' : 'Light Mode';
});

// Update high score live when backend leaderboard changes
setLeaderboardChangeCallback((updatedEntries) => {
  if (updatedEntries.length > 0 && updatedEntries[0].score > currentHighScore) {
    currentHighScore = updatedEntries[0].score;
    document.getElementById('high-score').textContent = `High Score: ${currentHighScore}`;
  }
});

// Initialize everything
initLeaderboardUI(startGame);
resize();
initHighScore();
startGame();
requestAnimationFrame(mainLoop);
