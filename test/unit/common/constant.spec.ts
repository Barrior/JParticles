import {
  defaultCanvasHeight,
  defaultCanvasWidth,
  doublePi,
  isIE8,
  isRuntimeSupported,
  orientationSupport,
  piBy180,
} from '@/src/common/constants'

test('piBy180', () => {
  expect(piBy180).toBe(Math.PI / 180)
})

test('doublePi', () => {
  expect(doublePi).toBe(Math.PI * 2)
})

test('default Canvas dimension', () => {
  expect(defaultCanvasWidth).toBe(485)
  expect(defaultCanvasHeight).toBe(300)
})

test('isIE8', () => {
  expect(isIE8).toBe(false)
})

test('isRuntimeSupported', () => {
  expect(isRuntimeSupported).toBe(true)
})

test('orientationSupport', () => {
  expect(orientationSupport).toBe(false)
})
