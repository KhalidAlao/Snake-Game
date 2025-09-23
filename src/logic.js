import { GRID_SIZE } from "./constants";

let snake, dx, dy, foodX, foodY, score, gameRunning;
let gameWidth, gameHeight;



function createFood() {
    foodX = Math.floor(Math.random() * (gameWidth / GRID_SIZE)) * GRID_SIZE;
    foodY = Math.floor(Math.random() * (gameHeight / GRID_SIZE)) * GRID_SIZE;
}



export function initGame() {

    // Position the snake in the middle of the grid
    const midX = Math.floor(gameWidth / 2 / GRID_SIZE) * GRID_SIZE;
    const midY = Math.floor(gameHeight / 2 / GRID_SIZE) * GRID_SIZE;
    snake = Array.from({ length: 5 }, (_, i) => ({ x: midX - i * GRID_SIZE, y: midY }));

    dx = GRID_SIZE;
    dy = 0;
    score = 0;
    gameRunning = true;

    createFood();

    console.log("Game initialized", snake, { foodX, foodY }, "score:", score);
};

export function getState() {

};

export function step() {

};

export function changeDirection() {};

export function reset() {};

export function setDimensions(width, height) {
    gameWidth = width;
    gameHeight = height;
};

export function registerListener() {};