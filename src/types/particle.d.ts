import { ShapeData } from '../common/shape'
import { CommonConfig } from './common-config'

export interface Options extends Partial<CommonConfig> {
  // 粒子个数，默认为容器宽度的 0.12 倍
  // (0, 1) 显示为容器宽度相应倍数的个数，0 & [1, +∞) 显示具体个数
  // 0 是没有意义的
  num: number

  // 粒子最大半径(0, +∞)
  maxR: number

  // 粒子最小半径(0, +∞)
  minR: number

  // 粒子最大运动速度(0, +∞)
  maxSpeed: number

  // 粒子最小运动速度(0, +∞)
  minSpeed: number

  // 两点连线的最大值
  // 在 range 范围内的两点距离小于 proximity，则两点之间连线
  // (0, 1) 显示为容器宽度相应倍数的个数，0 & [1, +∞) 显示具体个数
  proximity: number

  // 定位点的范围，范围越大连线越多
  // 当 range 等于 0 时，不连线，相关值无效
  // (0, 1) 显示为容器宽度相应倍数的个数，0 & [1, +∞) 显示具体个数
  range: number

  // 线段的宽度
  lineWidth: number

  // 连线的形状
  // spider: 散开的蜘蛛状
  // cube: 合拢的立方体状
  lineShape: 'spider' | 'cube'

  // 改变定位点坐标的事件元素
  // null 表示 canvas 画布，或传入原生元素对象，如 document 等
  eventElem: null | HTMLDocument | HTMLElement

  // 视差效果
  parallax: boolean

  // 定义粒子在视差图层里的层数及每层的层级大小，类似 css 里的 z-index。
  // 取值范围: [0, +∞)，值越小视差效果越强烈，0 则不动。
  // 定义四层粒子示例：[1, 3, 5, 10]
  parallaxLayer: number[]

  // 视差强度，值越小视差效果越强烈
  parallaxStrength: number
}

export interface IElement {
  // 粒子半径
  r: number
  // 粒子 x 坐标
  x: number
  // 粒子 y 坐标
  y: number
  // 每次绘制时，粒子在 x 轴方向的步进值，正负值
  vx: number
  // 每次绘制时，粒子在 y 轴方向的步进值，正负值
  vy: number
  // 粒子颜色
  color: string
  // 形状数据
  shape: ShapeData
  // 粒子在视差图层里的层数及每层的层级大小
  parallaxLayer: number
  // 粒子视差偏移值
  parallaxOffsetX: number
  parallaxOffsetY: number
}
