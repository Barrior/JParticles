import { CommonConfig } from './common-config'

export interface Options extends Partial<CommonConfig> {
  // 线条数量
  num: number
  // 最大宽度
  maxWidth: number
  // 最小宽度
  minWidth: number
  // 最大速度
  maxSpeed: number
  // 最小速度
  minSpeed: number
  // 线条最大倾斜角度 [0, 180], 逆时针表示
  // 3 点钟方向表示 0 度，12 点钟方向表示 90 度（即垂直），9 点钟方向表示 180 度。
  maxDegree: number
  // 最小倾斜角度
  minDegree: number

  // 运动的方向
  // x: 水平运动
  // y: 垂直运动
  // xy: 随机水平或垂直运动
  // direction: 'x',

  // 点击创建线条
  createOnClick: boolean
  // 创建线条的数量
  numberOfCreations: number
  // 线条溢出移除
  removeOnOverflow: boolean
  // 溢出补偿，让线条溢出容器多点距离（单位PX）, 取值范围：[0, +∞)
  overflowCompensation: number
  // 保留的线条个数，避免都被移除，removeOnOverflow 为 true 时生效
  reservedLines: number
}

export interface IElement {
  // 线条中心点 x 坐标
  x: number
  // 线条宽度
  width: number
  // 线条颜色
  color: string
  // 运动速度
  speed: number
  // 线条倾斜角度，取值范围为 [-180, 180]
  degree: number
}
