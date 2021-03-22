import { piBy180 } from '@src/common/constants'

/**
 * 角度转弧度
 */
export function degreesToRadians(degrees: number): number {
  return degrees * piBy180
}

/**
 * 弧度转角度
 */
export function radiansToDegrees(radians: number): number {
  return radians / piBy180
}

/**
 * 根据「原始值」及「范围值」计算数量
 * 当原始值为 (0, 1) 时，返回原始值与范围值的倍数
 * 当原始值为 0 或 [1, +∞) 时，返回原始值
 * @param value  原始值
 * @param range  范围值
 */
export function calcQuantity(value: number, range: number): number {
  return value > 0 && value < 1 ? value * range : value
}
