import { createFood } from '../src/logic.js';
import { GRID_SIZE } from '../src/constants.js';

test('createFood returns food with x and y', () => {
  const food = createFood(); // returns the updated food object
  expect(food).toBeDefined();
  expect(typeof food.x).toBe('number');
  expect(typeof food.y).toBe('number');
});

test('food spawns within grid bounds', () => {
  const food = createFood();
  expect(food.x).toBeGreaterThanOrEqual(0);
  expect(food.x % GRID_SIZE).toBe(0);
  expect(food.y).toBeGreaterThanOrEqual(0);
  expect(food.y % GRID_SIZE).toBe(0);
});

