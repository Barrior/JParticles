import { randomColor, randomInRange, randomSpeed } from '@src/utils/random'

test('randomInRange', () => {
  const result = randomInRange(20, 10)
  expect(result).toBeGreaterThanOrEqual(10)
  expect(result).toBeLessThan(20)
  expect(randomInRange(10, 10)).toBe(10)
})

test('randomSpeed', () => {
  const result = randomSpeed(20, 10)
  expect(result).toBeGreaterThanOrEqual(-20)
  expect(result).toBeLessThan(20)
  expect([10, -10]).toContain(randomSpeed(10, 10))
})

test('randomColor', () => {
  expect(randomColor()).toMatch(/#[\da-f]{6}/)
})
