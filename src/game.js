import { KEY_DOWN, KEY_LEFT,KEY_RIGHT,KEY_UP} from "./constants.js";
import { clearCanvas, drawSnake, drawFood } from "./renderer.js";
import { 
    initGame, 
    getState, 
    step, 
    snake, 
    gameRunning, 
    changeDirection, 
    isGameRunning,
    endGame,
    isPaused,
    togglePause,
    setDimensions, 


} from "./logic.js";
import { showModal, hideModal } from "./modals.js";
import { getEntries, checkAndAddHighScore } from "./leaderboard.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const playAgainBtn = document.getElementById("restart-game");
const restartGameBtn = document.getElementById("restart-btn");
const gameOverScreen = document.getElementById("game-over");
const finalScore = document.getElementById("final-score");

const upBtn = document.getElementById('up-btn');
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');
const downBtn = document.getElementById('down-btn');


let lastTime = 0;    // keeps track of the last time the snake moved
let gameAnimationFrame = null;


function main() {
    
    lastTime = 0;
    
    // Cancel any existing game loop
    if (gameAnimationFrame) {
        cancelAnimationFrame(gameAnimationFrame);
    }
    
    // Start new game loop
    gameAnimationFrame = requestAnimationFrame(gameLoop);
}

function resetGame() {

    if (gameAnimationFrame) {
        cancelAnimationFrame(gameAnimationFrame);
        gameAnimationFrame = null;
    }
    
    // Reset UI elements
    gameOverScreen.style.display = 'none';
    hideModal();
    
    // Reset game state
    initGame();
    
    // Reset game loop variables
    lastTime = 0;
    
    // Restart the game loop
    main();
}





function resizeCanvas() {
    const size = Math.min(canvas.parentElement.offsetWidth, canvas.parentElement.offsetHeight);
    canvas.width = size;
    canvas.height = size;
    
    // Set the game dimensions in the logic module
    setDimensions(canvas.width, canvas.height);
    
    // Only reset if game is already running
    if (isGameRunning()) {
        resetGame();
    }
}


function gameLoop(timestamp) {
    // Store the animation frame ID
    gameAnimationFrame = requestAnimationFrame(gameLoop);

    if (!isGameRunning() && !isPaused()) {
        return;
    }

    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    if (!isPaused() && isGameRunning()) {
        step(canvas, deltaTime);
        
        // Only check for game end if game is actually running
        if (isGameRunning()) {
            didGameEnd();
        }
    }

    const state = getState();

    const scoreElement = document.getElementById("score");
    if (scoreElement) {
        scoreElement.textContent = `Score: ${state.score}`;
    }

    clearCanvas(ctx, canvas);
    drawFood(ctx, state.food);
    drawSnake(ctx, state.snake);
}


function showLeaderboard() {
    const entries = getEntries();
    showModal('leaderboard', { entries });
}

function setupEventListeners() {
    document.addEventListener("keydown", (e) => {
       
        if (!isGameRunning()) return;  
       
        // Handle arrow keys for movement
        if ([KEY_LEFT, KEY_UP, KEY_RIGHT, KEY_DOWN].includes(e.keyCode)) {
            e.preventDefault();
            changeDirection(e);
        }
        // Handle pause key
        else if (e.key === 'p' || e.key === 'P') {
            e.preventDefault();
            
            togglePause();
            if (isPaused()) {
                showModal("paused");
            } else {
                hideModal();
            }
        }
    });

    // Add click handlers
    playAgainBtn.addEventListener("click", () => {
        
        resetGame();
    });
    
    restartGameBtn.addEventListener("click", () => {
        
        resetGame();
    });

    // Mobile controls
    upBtn.addEventListener('click', () => changeDirection({ keyCode: KEY_UP }));
    leftBtn.addEventListener('click', () => changeDirection({ keyCode: KEY_LEFT }));
    rightBtn.addEventListener('click', () => changeDirection({ keyCode: KEY_RIGHT }));
    downBtn.addEventListener('click', () => changeDirection({ keyCode: KEY_DOWN }));
}

function didGameEnd() {
    const head = snake[0];
    
    // Check wall collision
    const hitWall = head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height;
    
    // Check self collision (starting from index 4 to ignore the head and immediate neck)
    let hitSelf = false;
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            hitSelf = true;
            break;
        }
    }
    
    if (hitWall || hitSelf) {
        endGame(); // This sets gameRunning = false
        finalScore.textContent = `Score: ${getState().score}`;
        gameOverScreen.style.display = 'block';
         // Check if it's a high score and prompt for name if it is
         const currentScore = getState().score;
         const isHighScore = checkAndAddHighScore(currentScore);
         
         // Only show leaderboard if it was actually a high score
         if (isHighScore) {
             showLeaderboard();
         }
         return true;
    }
    
    return false;
}








window.addEventListener('load', () => {
    resizeCanvas();
    setupEventListeners();
    initGame();
    main();
});
window.addEventListener('resize', resizeCanvas);
