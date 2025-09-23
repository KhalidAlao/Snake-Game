import {GRID_SIZE, BASE_GAME_SPEED,FOOD_POINT,SPEED_INCREASE_AMOUNT, SPEED_INCREASE_THRESHOLD,KEY_DOWN, KEY_LEFT,KEY_RIGHT,KEY_UP } from "./constants.js";



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

let snake, dx, dy, foodX, foodY, score, gameLoop;
let highScore = localStorage.getItem('highScore') || 0;
let lastSpeedIncreaseScore = 0;
let gameRunning = true;
let currentGameSpeed;

function resizeCanvas() {
    const size = Math.min(canvas.parentElement.offsetWidth, canvas.parentElement.offsetHeight);
    canvas.width = size;
    canvas.height = size;
    resetGame();
}

function initGame() {
    const midX = Math.floor(canvas.width / 2 / GRID_SIZE) * GRID_SIZE;
    const midY = Math.floor(canvas.height / 2 / GRID_SIZE) * GRID_SIZE;
    snake = Array.from({ length: 5 }, (_, i) => ({ x: midX - i * GRID_SIZE, y: midY }));

    dx = GRID_SIZE;
    dy = 0;
    score = 0;
    currentGameSpeed = BASE_GAME_SPEED;

    document.getElementById('score').textContent = `Score: ${score}`;
    document.getElementById('high-score').textContent = `High Score: ${highScore}`;
    createFood();
    if (gameLoop) clearTimeout(gameLoop);
    clearCanvas();
    drawFood();
    drawSnake();
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

function drawSnakePart(part, index) {
    ctx.fillStyle = index === 0
        ? getComputedStyle(document.documentElement).getPropertyValue('--snake-head')
        : getComputedStyle(document.documentElement).getPropertyValue('--snake');
    ctx.fillRect(part.x, part.y, GRID_SIZE, GRID_SIZE);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.strokeRect(part.x, part.y, GRID_SIZE, GRID_SIZE);
}

function drawSnake() {
    snake.forEach((part, index) => drawSnakePart(part, index));
}

function advanceSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === foodX && head.y === foodY) {
        score += FOOD_POINT;
        document.getElementById('score').textContent = `Score: ${score}`;
        createFood();
    } else {
        snake.pop();
    }
}

function changeDirection(event) {
    if (!gameRunning) return;
    const key = event.keyCode;
    const goingUp = dy === -GRID_SIZE, goingDown = dy === GRID_SIZE;
    const goingRight = dx === GRID_SIZE, goingLeft = dx === -GRID_SIZE;

    if (key === KEY_LEFT && !goingRight) [dx, dy] = [-GRID_SIZE, 0];
    if (key === KEY_UP && !goingDown) [dx, dy] = [0, -GRID_SIZE];
    if (key === KEY_RIGHT && !goingLeft) [dx, dy] = [GRID_SIZE, 0];
    if (key === KEY_DOWN && !goingUp) [dx, dy] = [0, GRID_SIZE];
}

function randomGridPosition(min, max) {
    return Math.floor(Math.random() * (max - min) + min) * GRID_SIZE;
}

function createFood() {
    do {
        foodX = randomGridPosition(0, canvas.width / GRID_SIZE);
        foodY = randomGridPosition(0, canvas.height / GRID_SIZE);
    } while (snake.some(part => part.x === foodX && part.y === foodY));
}

function clearCanvas() {
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--canvas-bg');
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(128, 128, 128, 0.1)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= canvas.width; x += GRID_SIZE) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += GRID_SIZE) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--canvas-border');
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function drawFood() {
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--food');
    ctx.beginPath();
    ctx.arc(foodX + GRID_SIZE / 2, foodY + GRID_SIZE / 2, GRID_SIZE / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(foodX + GRID_SIZE / 3, foodY + GRID_SIZE / 3, GRID_SIZE / 6, 0, Math.PI * 2);
    ctx.fill();
}

function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    const head = snake[0];
    return head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height;
}

function main() {
    if (didGameEnd()) {
        if (gameRunning) {
            gameRunning = false;
            finalScore.textContent = `Score: ${score}`;
    
            saveScoreToLeaderboard(score);     
            renderLeaderboard();               
    
            gameOverScreen.style.display = 'flex';
        }
        return;
    }
    

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }

    if (score % SPEED_INCREASE_THRESHOLD === 0 && score !== 0 && score !== lastSpeedIncreaseScore) {
        currentGameSpeed -= SPEED_INCREASE_AMOUNT;
        lastSpeedIncreaseScore = score;
    }

    gameLoop = setTimeout(() => {
        clearCanvas();
        advanceSnake();
        drawFood();
        drawSnake();
        main();
    },  currentGameSpeed);
}

window.addEventListener('load', () => {
    resizeCanvas();
    setupEventListeners();
    initGame();
    main();
});
window.addEventListener('resize', resizeCanvas);
