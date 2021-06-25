import { pInt, toFixed, trimAll, upperFirst } from '@src/utils/str-num'

test('pInt', () => {
  expect(pInt('200px')).toBe(200)
  expect(pInt('0x200')).toBe(0)
})

test('toFixed', () => {
  expect(toFixed('20.12')).toBe(20)
  expect(toFixed(20.12)).toBe(20)
})

test('trimAll', () => {
  expect(trimAll(' st \n\n  r \t\r ing ')).toBe('string')
})

test('upperFirst', () => {
  expect(upperFirst('some')).toBe('Some')
})
