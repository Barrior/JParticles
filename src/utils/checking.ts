import { funcToString, objectCtorString } from '@src/common/constants'

/**
 * 类型检测
 * @param value 目标值
 * @param type 预期类型
 */
export function typeChecking(value: any, type: string): boolean {
  // 直接使用 toString.call(value) 在 ie 会下报错
  return Object.prototype.toString.call(value) === type
}

/**
 * 检测 value 是否为函数
 */
export function isFunction(value: any): boolean {
  return typeChecking(value, '[object Function]')
}

/**
 * 检测 value 是否为纯对象，即 {} 或 new Object() 创建的对象
 * 参见 https://lodash.com/docs/4.17.15#isPlainObject
 */
export function isPlainObject(value: any): boolean {
  if (!typeChecking(value, '[object Object]')) {
    return false
  }

  // 过滤 Object.create(null)
  const proto = Object.getPrototypeOf(value)
  if (proto === null) {
    return true
  }

  // 过滤 Object.create({}) 与 new Foo()
  const Ctor =
    Object.hasOwnProperty.call(proto, 'constructor') && proto.constructor

  return (
    typeof Ctor === 'function' &&
    Ctor instanceof Ctor &&
    funcToString.call(Ctor) === objectCtorString
  )
}

/**
 * 检测 value 是否为字符串
 */
export function isString(value: any): boolean {
  return typeof value === 'string'
}

/**
 * 检测 value 是否为数值
 */
export function isNumber(value: any): boolean {
  return typeof value === 'number'
}

/**
 * 检测 value 是否为布尔值
 */
export function isBoolean(value: any): boolean {
  return typeof value === 'boolean'
}

/**
 * 检测 value 是否为 Undefined
 */
export function isUndefined(value: any): boolean {
  return value === undefined
}

/**
 * 检测 value 是否为 Null
 */
export function isNull(value: any): boolean {
  return value === null
}

/**
 * 检测 value 是否为 Undefined 或者 Null
 */
export function isNil(value: any): boolean {
  return isUndefined(value) || isNull(value)
}

/**
 * 检测 value 是否为 DOM 元素
 */
export function isElement(value: any): boolean {
  // 1、document(nodeType: 9) 元素不能判断为 element，因为它没有很多 element 该有的属性，
  // 比如：getComputedStyle 获取不到它的宽高，就会报错。
  // 2、当传入 0 的时候，不加 !! 会返回 0，而不是 Boolean 值
  return !!(value && value.nodeType === 1)
}
