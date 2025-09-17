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
const gridSize = 15;
let gameSpeed = 100;
let lastSpeedIncreaseScore = 0;
let gameRunning = true;

function resizeCanvas() {
    const size = Math.min(canvas.parentElement.offsetWidth, canvas.parentElement.offsetHeight);
    canvas.width = size;
    canvas.height = size;
    resetGame();
}

function initGame() {
    const midX = Math.floor(canvas.width / 2 / gridSize) * gridSize;
    const midY = Math.floor(canvas.height / 2 / gridSize) * gridSize;
    snake = Array.from({ length: 5 }, (_, i) => ({ x: midX - i * gridSize, y: midY }));

    dx = gridSize;
    dy = 0;
    score = 0;

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
        if ([37, 38, 39, 40].includes(e.keyCode)) e.preventDefault();
        changeDirection(e);
    });

    restartBtn.addEventListener("click", resetGame);
    restartGameBtn.addEventListener("click", resetGame);

    upBtn.addEventListener('click', () => changeDirection({ keyCode: 38 }));
    leftBtn.addEventListener('click', () => changeDirection({ keyCode: 37 }));
    rightBtn.addEventListener('click', () => changeDirection({ keyCode: 39 }));
    downBtn.addEventListener('click', () => changeDirection({ keyCode: 40 }));
}

function drawSnakePart(part, index) {
    ctx.fillStyle = index === 0
        ? getComputedStyle(document.documentElement).getPropertyValue('--snake-head')
        : getComputedStyle(document.documentElement).getPropertyValue('--snake');
    ctx.fillRect(part.x, part.y, gridSize, gridSize);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.strokeRect(part.x, part.y, gridSize, gridSize);
}

function drawSnake() {
    snake.forEach((part, index) => drawSnakePart(part, index));
}

function advanceSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === foodX && head.y === foodY) {
        score += 10;
        document.getElementById('score').textContent = `Score: ${score}`;
        createFood();
    } else {
        snake.pop();
    }
}

function changeDirection(event) {
    if (!gameRunning) return;
    const key = event.keyCode;
    const goingUp = dy === -gridSize, goingDown = dy === gridSize;
    const goingRight = dx === gridSize, goingLeft = dx === -gridSize;

    if (key === 37 && !goingRight) [dx, dy] = [-gridSize, 0];
    if (key === 38 && !goingDown) [dx, dy] = [0, -gridSize];
    if (key === 39 && !goingLeft) [dx, dy] = [gridSize, 0];
    if (key === 40 && !goingUp) [dx, dy] = [0, gridSize];
}

function randomGridPosition(min, max) {
    return Math.floor(Math.random() * (max - min) + min) * gridSize;
}

function createFood() {
    do {
        foodX = randomGridPosition(0, canvas.width / gridSize);
        foodY = randomGridPosition(0, canvas.height / gridSize);
    } while (snake.some(part => part.x === foodX && part.y === foodY));
}

function clearCanvas() {
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--canvas-bg');
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(128, 128, 128, 0.1)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--canvas-border');
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function drawFood() {
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--food');
    ctx.beginPath();
    ctx.arc(foodX + gridSize / 2, foodY + gridSize / 2, gridSize / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(foodX + gridSize / 3, foodY + gridSize / 3, gridSize / 6, 0, Math.PI * 2);
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

    if (score % 100 === 0 && score !== 0 && score !== lastSpeedIncreaseScore) {
        gameSpeed += 5;
        lastSpeedIncreaseScore = score;
    }

    gameLoop = setTimeout(() => {
        clearCanvas();
        advanceSnake();
        drawFood();
        drawSnake();
        main();
    }, gameSpeed);
}

window.addEventListener('load', () => {
    resizeCanvas();
    setupEventListeners();
    initGame();
    main();
});
window.addEventListener('resize', resizeCanvas);
