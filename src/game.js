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
import { getEntries, qualifiesForLeaderboard, setLeaderboardChangeCallback} from './leaderboard.js';
import { showLeaderboard, initLeaderboardUI, promptTopScore } from './leaderboardUI.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartBtn = document.getElementById('restart-game');
const entries = getEntries();

let score = 0;
let accumulator = 0;
let moveInterval = 200;
let lastTime;

let currentHighScore = getEntries().length > 0 ? getEntries()[0].score : 0;
let isNewHighScore = false;


function updateHighScoreDisplay() {
    
   
    const newHighScore = entries.length > 0 ? entries[0].score : 0;
    
    if (newHighScore !== currentHighScore) {
      currentHighScore = newHighScore;
      document.getElementById('high-score').textContent = `High Score: ${currentHighScore}`;
    }
  }
  
  
  function checkAndUpdateHighScore(currentScore) {
    
    if (currentScore > currentHighScore) {
      isNewHighScore = true;
      currentHighScore = currentScore;
      document.getElementById('high-score').textContent = `High Score: ${currentHighScore} `;
      return true;
    }
    return false;
  }
  setLeaderboardChangeCallback((leaderboardEntries) => {
    updateHighScoreDisplay();
  });



function resize() {
  canvas.width = Math.floor((window.innerWidth * 0.8) / 20) * 20;
  canvas.height = Math.floor((window.innerHeight * 0.6) / 20) * 20;
  setDimensions(canvas.width, canvas.height);
}
window.addEventListener('resize', resize);

function updateScore(currentScore) {
    document.getElementById('score').textContent = `Score: ${currentScore}`;
    checkAndUpdateHighScore(currentScore);
}


function startGame() {
  initGame();
  score = 0;
  accumulator = 0;
  moveInterval = 200;
  isNewHighScore = false;
  updateHighScoreDisplay();
  updateScore(0);
}

function handleGameOver() {
    
    if (isNewHighScore) {
      promptTopScore(score);
    } else if (qualifiesForLeaderboard(score)) {
      promptTopScore(score);
    } else {
      showLeaderboard();
    }
    
    isNewHighScore = false;
  }

// Play Again
restartBtn.addEventListener('click', () => {
  startGame();
});

document.getElementById('restart-btn').addEventListener('click', () => {
  startGame();
});

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
  updateScore(score);

  requestAnimationFrame(mainLoop);
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'p' || e.key === 'P') togglePause();
  else changeDirection(e.keyCode || e.key);
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
});

document.getElementById('up-btn').addEventListener('click', () => changeDirection('ArrowUp'));
document.getElementById('down-btn').addEventListener('click', () => changeDirection('ArrowDown'));
document.getElementById('left-btn').addEventListener('click', () => changeDirection('ArrowLeft'));
document.getElementById('right-btn').addEventListener('click', () => changeDirection('ArrowRight'));

// Dark/Light Mode
const themeToggle = document.getElementById('theme-toggle');
const themeLabel = document.getElementById('theme-label');
themeToggle.addEventListener('click', () => {
  const html = document.documentElement;
  html.dataset.theme = html.dataset.theme === 'dark' ? 'light' : 'dark';
  themeLabel.textContent = html.dataset.theme === 'dark' ? 'Dark Mode' : 'Light Mode';
});

// Initialize
initLeaderboardUI();
resize();
startGame();
updateHighScoreDisplay();
requestAnimationFrame(mainLoop);
