import type { ShapeData } from '../common/shape'
import type { CommonConfig } from './common-config'

export interface Options extends Partial<CommonConfig> {
  // 每次随机创建的雪花数量（最多）
  num: number
  // 颜色
  color: string
  // 最大半径
  maxR: number
  // 最小半径
  minR: number
  // 最大速度
  maxSpeed: number
  // 最小速度
  minSpeed: number
  // 持续时间
  duration?: number
  // 是否随机变换飘落的方向
  swing: boolean
  // 变换方向的时间间隔，单位毫秒
  swingInterval: number
  // 变换方向的概率（达到时间间隔后），取值范围 [0, 1]
  swingProbability: number
  // 雪花是否自旋
  spin: boolean
  // 雪花最大运动角速度(0, 360)
  spinMaxSpeed: number
  // 雪花最小运动角速度(0, 360)
  spinMinSpeed: number
}

export interface IElement {
  // 半径
  r: number
  // x 坐标
  x: number
  // y 坐标
  y: number
  // 水平速度
  vx: number
  // 垂直速度，半径越大，垂直速度越快，这样比较有近快远慢的层次效果
  vy: number
  // 颜色值
  color: string
  // 变换方向的时间
  swingAt: number
  // 形状数据
  shape: ShapeData
  // 旋转角度
  rotate: number
  // 旋转速度
  rotateSpeed: number
}
