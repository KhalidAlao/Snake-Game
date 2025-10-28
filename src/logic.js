import { GRID_SIZE } from './config.js';

let snake = [];
let dx = GRID_SIZE;
let dy = 0;
const food = { x: 0, y: 0 };
let gameRunning = false;
let paused = false;
let width = 0;
let height = 0;

export function setDimensions(w, h) {
  width = w;
  height = h;
}

export function createFood() {
  do {
    food.x = Math.floor(Math.random() * (width / GRID_SIZE)) * GRID_SIZE;
    food.y = Math.floor(Math.random() * (height / GRID_SIZE)) * GRID_SIZE;
  } while (snake.some((p) => p.x === food.x && p.y === food.y));

  return food;
}

export function getState() {
  return { snake, food, score: snake.length * 5 };
}

export function getFood() {
  return food;
}

export function initGame() {
  const midX = Math.floor(width / 2 / GRID_SIZE) * GRID_SIZE;
  const midY = Math.floor(height / 2 / GRID_SIZE) * GRID_SIZE;
  snake = Array.from({ length: 5 }, (_, i) => ({ x: midX - i * GRID_SIZE, y: midY }));
  dx = GRID_SIZE;
  dy = 0;
  gameRunning = true;
  paused = false;
  createFood();
  return getState();
}

export function isGameRunning() {
  return gameRunning;
}

export function isPaused() {
  return paused;
}

export function togglePause() {
  paused = !paused;
  return paused;
}

export function getSnake() {
  return snake;
}

export function step() {
  if (!gameRunning) return false;
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  let ateFood = false;
  if (head.x === food.x && head.y === food.y) {
    ateFood = true;
    createFood();
  } else {
    snake.pop();
  }

  if (
    head.x < 0 ||
    head.x >= width ||
    head.y < 0 ||
    head.y >= height ||
    snake.slice(1).some((p) => p.x === head.x && p.y === head.y)
  ) {
    gameRunning = false;
  }

  return ateFood;
}

export function changeDirection(direction) {
  // direction should be { x: -1|0|1, y: -1|0|1 }
  if (direction && typeof direction.x === 'number' && typeof direction.y === 'number') {
    // Prevent 180-degree turns (extra safety)
    if (dx === -direction.x * GRID_SIZE && dy === -direction.y * GRID_SIZE) {
      return;
    }
    dx = direction.x * GRID_SIZE;
    dy = direction.y * GRID_SIZE;
  }
}
