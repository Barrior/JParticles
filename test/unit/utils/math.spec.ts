import {
  calcQuantity,
  degreesToRadians,
  radiansToDegrees,
} from '@src/utils/math'

test('degreesToRadians', () => {
  expect(degreesToRadians(0)).toBe(0)

  expect(degreesToRadians(30)).toBeLessThan(0.524)
  expect(degreesToRadians(30)).toBeGreaterThan(0.523)

  expect(degreesToRadians(90)).toBeLessThan(1.58)
  expect(degreesToRadians(90)).toBeGreaterThan(1.57)

  expect(degreesToRadians(180)).toBeLessThan(3.15)
  expect(degreesToRadians(180)).toBeGreaterThan(3.14)

  expect(degreesToRadians(270)).toBeLessThan(4.72)
  expect(degreesToRadians(270)).toBeGreaterThan(4.71)

  expect(degreesToRadians(360)).toBeLessThan(6.29)
  expect(degreesToRadians(360)).toBeGreaterThan(6.28)

  expect(degreesToRadians(720)).toBeLessThan(12.57)
  expect(degreesToRadians(720)).toBeGreaterThan(12.56)
})

test('radiansToDegrees', () => {
  expect(radiansToDegrees(0)).toBe(0)

  expect(radiansToDegrees(4.72)).toBeLessThan(271)
  expect(radiansToDegrees(4.72)).toBeGreaterThan(270)
})

test('calcQuantity', () => {
  expect(calcQuantity(-1, 100)).toBe(-1)
  expect(calcQuantity(0, 100)).toBe(0)
  expect(calcQuantity(20, 100)).toBe(20)
  expect(calcQuantity(200, 100)).toBe(200)
  expect(calcQuantity(0.1, 100)).toBe(10)
})
