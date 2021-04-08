import { CommonConfig } from './common-config'

export interface ComOptions {
  // 是否填充背景色，设置为 false 相关值无效
  fill: boolean | boolean[]

  // 填充的背景色，当 fill 设置为 true 时生效
  fillColor: string | string[]

  // 是否绘制边框，设置为 false 相关值无效
  line: boolean | boolean[]

  // 边框颜色，当 line 设置为 true 时生效
  lineColor: string | string[]

  // 边框宽度，空数组则随机 [.2, 2) 的宽度。
  lineWidth: number | number[]

  // 波纹横向偏移值，距离 Canvas 左边缘的偏移值
  // (0, 1) 表示容器宽度的倍数，0 & [1, +∞) 表示具体数值
  offsetLeft: number | number[]

  // 波纹纵向偏移值，波纹中点距离 Canvas 顶部的距离
  // (0, 1) 表示容器高度的倍数，0 & [1, +∞) 表示具体数值
  offsetTop: number | number[]

  // 波峰高度，(0, 1) 表示容器高度的倍数，0 & [1, +∞) 表示具体数值
  crestHeight: number | number[]

  // 波峰个数，即正弦周期个数，默认随机 [1, 0.2 * 容器宽度)
  crestCount: number | number[]

  // 运动速度，默认随机 [.1, .4)
  speed: number | number[]

  // 遮罩：图片 URL 地址、 Base64 格式、canvas 图像源
  mask?: string | CanvasImageSource

  // 遮罩模式，默认 normal
  maskMode?: 'normal' | 'ghost'
}

export interface Options extends ComOptions, Partial<CommonConfig> {
  // 波纹个数
  num: number
}

export type StdOptions = {
  [K in keyof ComOptions]: K extends 'maskMode' | 'mask'
    ? ComOptions[K]
    : Extract<ComOptions[K], unknown[]>
}

export interface IElement {
  // x 坐标
  x: number
  // y 坐标
  y: number
}

export type StrNumBool = string | number | boolean
