import { GRID_SIZE, KEY_LEFT, KEY_UP, KEY_RIGHT, KEY_DOWN} from "./constants.js";

let snake, dx, dy, foodX, foodY, score, gameRunning;
let gameWidth, gameHeight;



function createFood() {
    do {
        foodX = Math.floor(Math.random() * (gameWidth / GRID_SIZE)) * GRID_SIZE;
        foodY = Math.floor(Math.random() * (gameHeight / GRID_SIZE)) * GRID_SIZE;
    } while (snake?.some(part => part.x === foodX && part.y === foodY));
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

    return {
        snake,
        food: { x: foodX, y: foodY },
        score,
        running: gameRunning
    };

}; // Describes current game state

export function step(canvas) {
    // new head position
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  
    // add new head at front
    snake.unshift(head);
  
    // check food
    if (head.x === foodX && head.y === foodY) {
      score++;
      placeFood(canvas);
    } else {
      // remove tail if no food eaten
      snake.pop();
    }
  }

  export function changeDirection(keyCode) {
    if (!gameRunning) return;

    const goingUp = dy === -GRID_SIZE;
    const goingDown = dy === GRID_SIZE;
    const goingRight = dx === GRID_SIZE;
    const goingLeft = dx === -GRID_SIZE;

    if (keyCode === KEY_LEFT && !goingRight) {
        dx = -GRID_SIZE;
        dy = 0;
    }
    if (keyCode === KEY_UP && !goingDown) {
        dx = 0;
        dy = -GRID_SIZE;
    }
    if (keyCode === KEY_RIGHT && !goingLeft) {
        dx = GRID_SIZE;
        dy = 0;
    }
    if (keyCode === KEY_DOWN && !goingUp) {
        dx = 0;
        dy = GRID_SIZE;
    }
}

export function reset() {};

export function setDimensions(width, height) {
    gameWidth = width;
    gameHeight = height;
};

export function registerListener() {
    document.addEventListener("keydown", (event) => {
        changeDirection(event.keyCode);
    });
}