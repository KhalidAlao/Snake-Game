import { initGame, step, changeDirection, getSnake, getFood, isGameRunning, isPaused, togglePause, setDimensions } from "./logic.js";
import { clearCanvas, drawSnake, drawFood } from "./renderer.js";
import { addOrUpdateEntry, qualifiesForLeaderboard } from "./leaderboard.js";
import { showLeaderboard, initLeaderboardUI } from "./leaderboardUI.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let highScore = 0;
let accumulator = 0;
let moveInterval = 200;
let lastTime;

// Game Over overlay
const gameOverOverlay = document.getElementById("game-over");
const finalScoreEl = document.getElementById("final-score");
const playAgainBtn = document.getElementById("play-again-btn");
const showLeaderboardBtn = document.getElementById("show-leaderboard-btn");

function resize(){
    canvas.width = Math.floor(window.innerWidth*0.8/20)*20;
    canvas.height = Math.floor(window.innerHeight*0.6/20)*20;
    setDimensions(canvas.width, canvas.height);
}
window.addEventListener("resize", resize);

function updateScore(s){ document.getElementById("score").textContent=`Score: ${s}`; }
function updateHighScore(){ document.getElementById("high-score").textContent=`High Score: ${highScore}`; }

function handleGameOver(){
    highScore = Math.max(highScore, score);
    updateHighScore();

    finalScoreEl.textContent = `Score: ${score}`;
    gameOverOverlay.classList.remove("hidden");

    if(qualifiesForLeaderboard(score)){
        const name = prompt(`Congratulations on a top 5 score! Score: ${score}. Enter name:`)?.trim();
        if(name) addOrUpdateEntry(name, score);
    }
}

// Play Again
playAgainBtn.addEventListener("click", () => {
    gameOverOverlay.classList.add("hidden");
    startGame();
});

// Show Leaderboard from overlay
showLeaderboardBtn.addEventListener("click", () => showLeaderboard());

function mainLoop(timestamp){
    if(!lastTime) lastTime = timestamp;
    const delta = timestamp - lastTime;
    lastTime = timestamp;

    if(isGameRunning() && !isPaused()){
        accumulator += delta;
        while(accumulator >= moveInterval){
            accumulator -= moveInterval;
            const ate = step();
            if(ate){
                score += 5;
                updateScore(score);
                if(score % 50 === 0) moveInterval = Math.max(50, moveInterval - 20);
            }
            if(!isGameRunning()){
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

function startGame(){
    initGame();
    score = 0;
    accumulator = 0;
    moveInterval = 200;
}

window.addEventListener("keydown", e => {
    if(e.key === 'p' || e.key === 'P') togglePause();
    else changeDirection(e.keyCode || e.key);
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) e.preventDefault();
});

document.getElementById("up-btn").addEventListener("click", ()=>changeDirection("ArrowUp"));
document.getElementById("down-btn").addEventListener("click", ()=>changeDirection("ArrowDown"));
document.getElementById("left-btn").addEventListener("click", ()=>changeDirection("ArrowLeft"));
document.getElementById("right-btn").addEventListener("click", ()=>changeDirection("ArrowRight"));

// Dark/Light Mode
const themeToggle = document.getElementById("theme-toggle");
const themeLabel = document.getElementById("theme-label");
themeToggle.addEventListener("click", () => {
    const html = document.documentElement;
    html.dataset.theme = html.dataset.theme === "dark" ? "light" : "dark";
    themeLabel.textContent = html.dataset.theme==="dark" ? "Dark Mode" : "Light Mode";
});

// Initialize
initLeaderboardUI();
resize();
startGame();
requestAnimationFrame(mainLoop);
