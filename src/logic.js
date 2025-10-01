import { GRID_SIZE, KEY_LEFT, KEY_UP, KEY_RIGHT, KEY_DOWN} from "./constants.js";
import { hideModal } from "./modals.js";


let snake;
let gameRunning;

let dx, dy, foodX, foodY, score;

let gameWidth, gameHeight;

let moveInterval = 200; // start speed (ms between moves)
let moveAccumulator = 0; // tracks time between last move 

let paused = false;





function isGameRunning() {
    return gameRunning;
}
function endGame() {
    gameRunning = false;
}


function createFood() {
    do {
        foodX = Math.floor(Math.random() * (gameWidth / GRID_SIZE)) * GRID_SIZE;
        foodY = Math.floor(Math.random() * (gameHeight / GRID_SIZE)) * GRID_SIZE;
    } while (snake?.some(part => part.x === foodX && part.y === foodY));
}



function initGame() {

    // Reset snake position
    const midX = Math.floor(gameWidth / 2 / GRID_SIZE) * GRID_SIZE;
    const midY = Math.floor(gameHeight / 2 / GRID_SIZE) * GRID_SIZE;
    snake = Array.from({ length: 5 }, (_, i) => ({ x: midX - i * GRID_SIZE, y: midY }));

    // Reset movement and score
    dx = GRID_SIZE;
    dy = 0;
    score = 0;
    gameRunning = true;
    paused = false;
    
    // Reset game speed
    moveInterval = 200;
    moveAccumulator = 0;

    createFood();

    console.log("Game initialized", snake, { foodX, foodY }, "score:", score);
};

// Describes current game state
 function getState() {
    return { snake, food: { x: foodX, y: foodY }, score };
}


 function step(canvas, deltaTime) {
    // accumulate time
    moveAccumulator += deltaTime;

    // only update if enough time has passed
    while (moveAccumulator >= moveInterval) {
        moveAccumulator -= moveInterval;

        // new head position
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);

        // check food
        if (head.x === foodX && head.y === foodY) {
            score += 5;

            createFood();

            // 🎯 increase speed every 50 points
            if (score % 50 === 0) {
                moveInterval = Math.max(50, moveInterval - 20);
            }
        } else {
            // remove tail if no food eaten
            snake.pop();
        }
    }
}


 function changeDirection(event) {
    if (!gameRunning) return;

    const goingUp = dy === -GRID_SIZE;
    const goingDown = dy === GRID_SIZE;
    const goingRight = dx === GRID_SIZE;
    const goingLeft = dx === -GRID_SIZE;

    // Support both keyCode and modern key properties
    const key = event.keyCode || event.key;
    
    if ((key === KEY_LEFT || key === 'ArrowLeft') && !goingRight) {
        dx = -GRID_SIZE;
        dy = 0;
        console.log("Moving LEFT");
    }
    else if ((key === KEY_UP || key === 'ArrowUp') && !goingDown) {
        dx = 0;
        dy = -GRID_SIZE;
        console.log("Moving UP");
    }
    else if ((key === KEY_RIGHT || key === 'ArrowRight') && !goingLeft) {
        dx = GRID_SIZE;
        dy = 0;
        console.log("Moving RIGHT");
    }
    else if ((key === KEY_DOWN || key === 'ArrowDown') && !goingUp) {
        dx = 0;
        dy = GRID_SIZE;
        console.log("Moving DOWN");
    }
}


 function setDimensions(width, height) {
    gameWidth = width;
    gameHeight = height;
};



 function isPaused() {
    return paused;
}

 function togglePause() {
    paused = !paused;
}

export { 
    snake, 
    gameRunning, 
    initGame, 
    getState, 
    step, 
    changeDirection, 
    isGameRunning, 
    endGame,
    isPaused,
    togglePause,
    setDimensions,
   

    
};