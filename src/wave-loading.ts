import { EVENT_NAMES_WAVE_LOADING } from '@src/common/constants'
import easing from '@src/common/easing'
import { CommonConfig } from '@src/types/common-config'
import { ValueOf } from '@src/types/utility-types'
import { InputOptions, Options } from '@src/types/wave-loading'
import { isPlainObject, isString, merge } from '@src/utils'

import Wave, { ComplexOptions, PlainOptions } from './wave'

const plainOptionsWL = [
  'font',
  'textColor',
  'textFormatter',
  'borderRadius',
] as const

export type PlainOptionsWL = ValueOf<typeof plainOptionsWL>

export default class WaveLoading extends Wave {
  static defaultConfig = {
    num: 1,

    // [font style][font weight][font size][font family]
    // 文本样式，同css一样，必须包含 [font size] 和 [font family]
    font: 'normal 400 16px Arial',

    // 文本颜色
    textColor: '#333',

    // 进度文本模板
    textFormatter: 'loading...%d%',

    fill: true,

    line: false,

    // 填充的背景色
    fillColor: '#27C9E5',

    // 画布外边框圆角
    borderRadius: '50%',

    // 线条横向偏移值，距离canvas画布左边的偏移值
    // (0, 1)表示容器宽度的倍数，0 & [1, +∞)表示具体数值
    offsetLeft: 0,

    // 波峰高度，(0, 1)表示容器高度的倍数，0 & [1, +∞)表示具体数值
    crestHeight: 4,

    // 波纹个数，即正弦周期个数
    crestCount: 1,

    // 波浪的运动速度
    speed: 0.3,

    // 加载到 99% 的时长，单位毫秒(ms)
    // 用时越久，越慢加载到 99%。
    duration: 5000,

    // 加载过程的运动效果，
    // 目前支持匀速(linear)，先加速再减速(swing)，两种
    easing: 'swing',
  } as unknown as Options

  // 进度阈值
  static progressThreshold = 99.99

  protected readonly options!: Options & CommonConfig

  // 当前进度
  private progress = 0

  // 画布半高
  private halfCH!: number

  // 是否立即完成
  private isCompletedImmediately = false

  // 立即完成时的进度步进值
  private fastStepValue = 1

  // easing 动画开始时间
  private startTime?: number

  constructor(selector: string | HTMLElement, options?: Partial<InputOptions>) {
    super(selector, merge({}, WaveLoading.defaultConfig, options))
  }

  /**
   * 初始化数据和运行程序
   */
  protected init(): void {
    this.halfCH = this.canvasHeight / 2

    // WaveLoading methods
    this.setOffsetTop(this.canvasHeight)
    this.setCanvasStyle()

    // Wave methods
    this.ownResizeEvent()
    this.optionsNormalize()
    this.loadMaskImage()
    this.createDots()

    // WaveLoading resize 事件需要放到 Wave 的后面
    this.waveLoadingResizeEvent()
  }

  /**
   * 设置 offsetTop 值
   * @param top 高度值
   */
  private setOffsetTop(top: number): void {
    const { offsetTop } = this.options
    if (Array.isArray(offsetTop)) {
      offsetTop.forEach((_item, i, arr) => {
        arr[i] = top
      })
    } else {
      this.options.offsetTop = top
    }
  }

  /**
   * 设置画布 CSS 样式
   */
  private setCanvasStyle(): void {
    this.canvas.style.borderRadius = this.options.borderRadius
  }

  /**
   * 绘制入口：计算进度，绘制波纹等
   */
  protected draw(): void {
    this.calcProgress()

    if (this.progress < 100) {
      this.mainDrawing()
      this.requestAnimationFrame()
    } else {
      this.progress = 100
      this.mainDrawing()
      this.eventEmitter.trigger(EVENT_NAMES_WAVE_LOADING.FINISHED)
    }
  }

  /**
   * 绘制图案
   */
  private mainDrawing() {
    this.eventEmitter.trigger(EVENT_NAMES_WAVE_LOADING.PROGRESS, this.progress)
    this.calcOffsetTop()
    this.clearCanvasAndSetGlobalAttrs()

    // 调用 Wave 方法
    this.renderMaskMode(() => {
      this.drawWaves()
    })

    // 调用 WaveLoading 方法
    this.drawText()
  }

  /**
   * 绘制进度文本
   */
  private drawText() {
    const { ctx, canvasWidth, halfCH, progress } = this
    const { font, textFormatter, textColor } = this.options

    if (!isString(textFormatter) || !textFormatter) return

    // 替换文本模板真实值
    const text = textFormatter.replace(/%d/g, String(Math.floor(progress)))

    ctx.save()
    ctx.font = font

    const textWidth = ctx.measureText(text).width
    const x = (canvasWidth - textWidth) / 2

    ctx.textBaseline = 'middle'
    ctx.fillStyle = textColor
    ctx.font = font
    ctx.fillText(text, x, halfCH)
    ctx.restore()
  }

  /**
   * 计算进度值
   */
  private calcProgress() {
    // 立即完成逻辑，采用快速步进值计算进度
    if (this.isCompletedImmediately) {
      this.progress += this.fastStepValue
      this.fastStepValue += 0.5
      return
    }

    // 悬停 99% 时，跳出计算，减少性能损耗
    if (this.progress >= WaveLoading.progressThreshold) return

    if (!this.startTime) {
      this.startTime = Date.now()
    }

    // x: percent complete      percent complete: elapsedTime / duration
    // t: elapsed time          elapsed time: currentTime - startTime
    // b: beginning value       start value
    // c: change in value       finish value
    // d: duration              duration
    const time = Date.now() - this.startTime
    const percent = time / this.options.duration

    if (percent <= 1) {
      this.progress = easing[this.options.easing](
        // x, t, b, c, d
        percent,
        time,
        0,
        100,
        this.options.duration
      )

      // 1、防止 progress 超出 100
      // 2、通过 easing 函数返回的值可能悬停 99.7，加 0.9 让进度达到阈值
      if (this.progress + 0.9 >= WaveLoading.progressThreshold) {
        this.progress = WaveLoading.progressThreshold
      }
    }
  }

  /**
   * 根据进度计算波纹 offsetTop 值
   */
  private calcOffsetTop() {
    // 退出以提高性能
    if (
      !this.isCompletedImmediately &&
      this.progress >= WaveLoading.progressThreshold
    ) {
      return
    }

    const maxCrestHeight = Math.max(...(this.options.crestHeight as number[]))

    const top =
      this.progress === 100
        ? -maxCrestHeight
        : Math.ceil(
            ((100 - this.progress) / 100) * this.canvasHeight + maxCrestHeight
          )

    this.setOffsetTop(top)
  }

  /**
   * 窗口尺寸调整事件
   */
  protected waveLoadingResizeEvent(): void {
    this.onResize(() => {
      this.halfCH = this.canvasHeight / 2
      if (this.progress === 100) {
        this.draw()
      }
    })
  }

  /**
   * 方法：动态设置属性值
   */
  setOptions(
    newOptions: Partial<
      Pick<Options, ComplexOptions | PlainOptions | PlainOptionsWL>
    >
  ): void {
    if (!this.isRunningSupported || !isPlainObject(newOptions)) return

    // 调用 Wave 更新项
    super.setOptions(newOptions)

    for (const property in newOptions) {
      if (
        Object.hasOwnProperty.call(newOptions, property) &&
        plainOptionsWL.indexOf(property as never) !== -1
      ) {
        const newValue = newOptions[property as PlainOptionsWL]
        this.options[property as PlainOptionsWL] = newValue as never
        if (property === 'borderRadius') {
          this.setCanvasStyle()
        }
      }
    }
  }

  /**
   * 方法：让进度立即加载完成
   */
  done(): void {
    if (this.isRunningSupported && !this.isCompletedImmediately) {
      this.isCompletedImmediately = true
    }
  }

  /**
   * 事件：进度每次改变的时候触发
   */
  onProgress(...args: Array<(progress: number) => void>): this {
    this.eventEmitter.on(EVENT_NAMES_WAVE_LOADING.PROGRESS, ...args)
    return this
  }

  /**
   * 事件：进度加载到 100% 后触发
   */
  onFinished(...args: Array<() => void>): this {
    this.eventEmitter.on(EVENT_NAMES_WAVE_LOADING.FINISHED, ...args)
    return this
  }
}
