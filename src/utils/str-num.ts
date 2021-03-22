import { regExp } from '@src/common/constants'

/**
 * 包装原生 parseInt，确保输出十进制数值
 */
export function pInt(s: string | number, radix = 10): number {
  return parseInt(s, radix)
}

/**
 * 包装原生 toFixed，确保输出数字而不是字符串
 */
export function toFixed(num: number | string, digits = 0): number {
  return parseFloat(Number(num).toFixed(digits))
}

/**
 * 移除字符串内所有空白，包括空格、空行、制表符
 */
export function trimAll(str: string): string {
  return str.replace(regExp.trimAll, '')
}

/**
 * 将字符串首字母转换成大写
 */
export function upperFirst(str: string): string {
  return str[0].toUpperCase() + str.substring(1)
}
