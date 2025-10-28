import { GRID_SIZE } from './config.js';

export function clearCanvas(ctx, canvas) {
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--canvas-bg');
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(128,128,128,0.1)';
  ctx.lineWidth = 0.5;
  for (let x = 0; x <= canvas.width; x += GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= canvas.height; y += GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--canvas-border');
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

export function drawSnake(ctx, snake) {
  snake.forEach((part, i) => {
    ctx.fillStyle =
      i === 0
        ? getComputedStyle(document.documentElement).getPropertyValue('--snake-head')
        : getComputedStyle(document.documentElement).getPropertyValue('--snake');
    ctx.fillRect(part.x, part.y, GRID_SIZE, GRID_SIZE);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.strokeRect(part.x, part.y, GRID_SIZE, GRID_SIZE);
  });
}

export function drawFood(ctx, food) {
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--food');
  ctx.beginPath();
  ctx.arc(food.x + GRID_SIZE / 2, food.y + GRID_SIZE / 2, GRID_SIZE / 2 - 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.beginPath();
  ctx.arc(food.x + GRID_SIZE / 3, food.y + GRID_SIZE / 3, GRID_SIZE / 6, 0, Math.PI * 2);
  ctx.fill();
}
