import { Options as WaveOptions } from './wave'

export interface Options extends WaveOptions {
  // [font style][font weight][font size][font family]
  // 文本样式，同css一样，必须包含 [font size] 和 [font family]
  font: string

  // 文本颜色
  textColor: string

  // 进度文本模板，`%d` 将被替换成取整的进度值
  textFormatter: string

  // 画布外边框圆角
  borderRadius: string

  // 加载到 99% 的时长，单位毫秒(ms)
  // 用时越久，越慢加载到 99%。
  duration: number

  // 加载过程的缓动效果
  // 目前支持匀速(linear)，先加速再减速(swing)，两种
  easing: 'linear' | 'swing' | 'easeInOutQuad'
}

export type InputOptions = Omit<Options, 'offsetTop' | 'color'>

export interface IElement {
  // x 坐标
  x: number
  // y 坐标
  y: number
}
