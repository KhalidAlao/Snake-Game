import { jest } from '@jest/globals';
import { GRID_SIZE } from '../src/constants.js';

describe('step() - moving behavior', () => {
    let logic;
  
    beforeEach(async () => {
      jest.resetModules();
      logic = await import('../src/logic.js');
  
      // use a fixed grid so the math is easy
      logic.setDimensions(200, 200);
  
      // reset to known starting state
      logic.initGame();
    });
  
    test('snake moves forward without eating', () => {
      const snakeBefore = logic.getSnake();
      const lengthBefore = snakeBefore.length;
      const headBefore = { ...snakeBefore[0] };
  
      // Act
      const ate = logic.step();
  
      // Assert
      expect(ate).toBe(false); // didn’t eat
      const snakeAfter = logic.getSnake();
  
      // length unchanged
      expect(snakeAfter.length).toBe(lengthBefore);
  
      // head moved right by GRID_SIZE
      expect(snakeAfter[0].x).toBe(headBefore.x + GRID_SIZE);
      expect(snakeAfter[0].y).toBe(headBefore.y);
    });
  });
  