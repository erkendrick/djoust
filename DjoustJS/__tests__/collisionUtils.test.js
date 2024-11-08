import { isColliding } from '../utils/collisionUtils'; 

describe('isColliding utility function', () => {
  test('returns true for colliding rectangles', () => {
 
    const rectA = { x: 0, y: 0, width: 5, height: 5 };
    const rectB = { x: 4, y: 4, width: 5, height: 5 };

    expect(isColliding(rectA, rectB)).toBe(true);
  });

  test('returns false for non-colliding rectangles', () => {
    
    const rectA = { x: 0, y: 0, width: 5, height: 5 };
    const rectB = { x: 10, y: 10, width: 5, height: 5 };

    expect(isColliding(rectA, rectB)).toBe(false);
  });
});