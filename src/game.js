import { KEY_DOWN, KEY_LEFT,KEY_RIGHT,KEY_UP} from "./constants.js";
import { clearCanvas, drawSnake, drawFood } from "./renderer.js";
import { initGame, getState, step, snake, gameRunning, changeDirection, isGameRunning} from "./logic.js";
import { showModal, hideModal } from "./modals.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartBtn = document.getElementById("restart-btn");
const restartGameBtn = document.getElementById("restart-game");
const gameOverScreen = document.getElementById("game-over");
const finalScore = document.getElementById("final-score");

const upBtn = document.getElementById('up-btn');
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');
const downBtn = document.getElementById('down-btn');


let highScore = localStorage.getItem('highScore') || 0;
let lastTime = 0;    // keeps track of the last time the snake moved




initGame();


function resizeCanvas() {
    const size = Math.min(canvas.parentElement.offsetWidth, canvas.parentElement.offsetHeight);
    canvas.width = size;
    canvas.height = size;
    resetGame();
}

function resetGame() {
    gameRunning = true;
    gameOverScreen.style.display = 'none';
    if (gameLoop) clearTimeout(gameLoop);
    initGame();
    main();
}

function setupEventListeners() {
    document.addEventListener("keydown", (e) => {
        if ([KEY_LEFT, KEY_UP, KEY_RIGHT, KEY_DOWN].includes(e.keyCode)) e.preventDefault();
        changeDirection(e);
    });

    restartBtn.addEventListener("click", resetGame);
    restartGameBtn.addEventListener("click", resetGame);

    upBtn.addEventListener('click', () => changeDirection({ keyCode: KEY_UP }));
    leftBtn.addEventListener('click', () => changeDirection({ keyCode: KEY_LEFT }));
    rightBtn.addEventListener('click', () => changeDirection({ keyCode: KEY_RIGHT }));
    downBtn.addEventListener('click', () => changeDirection({ keyCode: KEY_DOWN }));
}




function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    const head = snake[0];
    return head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height;
}


function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    if (!isPaused() && isGameRunning()) {
        step(canvas, deltaTime); // only update state if not paused
    }
    
    
    if (!isGameRunning()) {
        didGameEnd();
    };// stop if game ended

    const state = getState();// get updated state
    clearCanvas(ctx, canvas);
    drawFood(ctx, state.food);
    drawSnake(ctx, state.snake);

    requestAnimationFrame(gameLoop); // next frame
}


function main() {
    }
    lastTime = 0;
    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
    if (!isGameRunning()) return;  
    if (e.key === 'p' || e.key === 'P') {
        togglePause();
        if (isPaused()) {
            showModal("paused");
        } else {
            hideModal();
        }
    }
});

window.addEventListener('load', () => {
    resizeCanvas();
    setupEventListeners();
    initGame();
    main();
});
window.addEventListener('resize', resizeCanvas);
