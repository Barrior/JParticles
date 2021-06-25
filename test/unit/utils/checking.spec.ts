import {
  isArray,
  isBoolean,
  isElement,
  isFunction,
  isNil,
  isNull,
  isNumber,
  isPlainObject,
  isString,
  isUndefined,
  typeChecking,
} from '@src/utils/checking'

const types = [
  { type: '[object Function]', label: 'func', value: () => 0 },
  { type: '[object Object]', label: 'obj', value: {} },
  { type: '[object Array]', label: 'arr', value: [] },
  { type: '[object String]', label: 'str', value: 'string' },
  { type: '[object Boolean]', label: 'bool', value: true },
  { type: '[object Boolean]', label: 'bool', value: false },
  { type: '[object Number]', label: 'num', value: 0 },
  { type: '[object Number]', label: 'num', value: 1 },
  { type: '[object Number]', label: 'num', value: NaN },
  { type: '[object Null]', label: 'null', value: null },
  { type: '[object Undefined]', label: 'undef', value: undefined },
  { type: '[object Symbol]', label: 'sym', value: Symbol() },
]

test('typeChecking', () => {
  types.forEach((item) => {
    expect(typeChecking(item.value, item.type)).toBe(true)
  })
})

test('isFunction', () => {
  types.forEach((item) => {
    expect(isFunction(item.value)).toBe(item.label === 'func')
  })
})

test('isPlainObject', () => {
  types.forEach((item) => {
    expect(isPlainObject(item.value)).toBe(item.label === 'obj')
  })
})

test('isArray', () => {
  types.forEach((item) => {
    expect(isArray(item.value)).toBe(item.label === 'arr')
  })
})

test('isString', () => {
  types.forEach((item) => {
    expect(isString(item.value)).toBe(item.label === 'str')
  })
})

test('isBoolean', () => {
  types.forEach((item) => {
    expect(isBoolean(item.value)).toBe(item.label === 'bool')
  })
})

test('isNumber', () => {
  types.forEach((item) => {
    expect(isNumber(item.value)).toBe(item.label === 'num')
  })
})

test('isNull', () => {
  types.forEach((item) => {
    expect(isNull(item.value)).toBe(item.label === 'null')
  })
})

test('isUndefined', () => {
  types.forEach((item) => {
    expect(isUndefined(item.value)).toBe(item.label === 'undef')
  })
})

test('isNil', () => {
  types.forEach((item) => {
    expect(isNil(item.value)).toBe(
      item.label === 'null' || item.label === 'undef'
    )
  })
})

test('isElement', () => {
  types.forEach((item) => {
    expect(isElement(item.value)).toBe(false)
  })
  expect(isElement(document)).toBe(false)
  expect(isElement(document.createTextNode('text'))).toBe(false)
  expect(isElement(document.body)).toBe(true)
  expect(isElement(document.querySelector('head'))).toBe(true)
  expect(isElement(document.querySelector('html'))).toBe(true)
  expect(isElement(document.createElement('i'))).toBe(true)
})
