import './polyfill'

import commonConfig from '@src/common/config'
import {
  defaultCanvasHeight,
  defaultCanvasWidth,
  EVENT_NAMES,
  isRuntimeSupported,
} from '@src/common/constants'
import Events from '@src/common/events'
import { CommonConfig } from '@src/types/common-config'
import {
  getNumberValueOfStyle,
  isElement,
  isPlainObject,
  isString,
  merge,
  observeElementRemoved,
  randomColor,
} from '@src/utils'

export interface GeneralElement {
  x: number
  y: number
}

export default abstract class Base<Options> {
  // 所有参数
  protected readonly options!: Options & CommonConfig

  // 包裹 canvas 的容器
  protected readonly container?: HTMLElement | null

  // 画布
  protected readonly canvas!: HTMLCanvasElement

  // 画布宽度
  protected canvasWidth!: number

  // 画布高度
  protected canvasHeight!: number

  // 绘图环境
  protected readonly ctx!: CanvasRenderingContext2D

  // 颜色工具函数，返回随机或设定好的（粒子）颜色
  protected readonly getColor!: () => string

  // （粒子）数据集
  protected elements: unknown[] = []

  // Canvas 是否从 DOM 中移除了
  protected isCanvasRemoved = false

  // 是否暂停运动了
  protected isPaused = false

  // 窗口尺寸改变处理函数，对应调整（粒子）位置
  protected resizeHandler?: () => void

  // 事件中心，文档参考 https://taro-docs.jd.com/taro/docs/apis/about/events/
  protected eventEmitter = new Events()

  // 特效是否支持运行
  protected isRunningSupported = false

  protected constructor(
    defaultConfig: Options,
    selector: string | HTMLElement,
    options?: Partial<Options>
  ) {
    // 对于不支持运行特效的浏览器（如 IE8）将不支持创建特效
    if (!isRuntimeSupported) return

    this.container = isElement(selector)
      ? (selector as HTMLElement)
      : document.querySelector<HTMLElement>(selector as string)

    this.isRunningSupported = !!this.container

    if (this.container) {
      this.options = merge({}, commonConfig, defaultConfig, options)
      this.canvas = document.createElement('canvas')
      this.ctx = this.canvas.getContext('2d')!

      this.container.innerHTML = ''
      this.container.appendChild(this.canvas)

      // 缓存颜色获取函数，提高性能
      this.getColor = this.makeColorMethod()
    }
  }

  /**
   * 引导程序
   */
  protected bootstrap(): void {
    if (this.isRunningSupported) {
      this.setCanvasDimension()
      this.observeCanvasRemoved()
      this.resizeEvent()
      this.init()
      this.draw()
    }
  }

  /**
   * 初始化数据或方法调用
   */
  protected abstract init(): void

  /**
   * 绘图入口
   */
  protected abstract draw(): void

  /**
   * 清除整个画布
   */
  protected clearCanvasAndSetGlobalAttrs(): void {
    const { ctx, canvasWidth, canvasHeight } = this
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx.globalAlpha = this.options.opacity
  }

  /**
   * 生成 "getColor" 函数
   */
  protected makeColorMethod(): () => string {
    const { color } = this.options
    const colorLength = Array.isArray(color) ? color.length : 0

    if (isString(color)) {
      return () => color as string
    }

    if (colorLength === 0) {
      return randomColor
    }

    return () => (color as string[])[Math.floor(Math.random() * colorLength)]
  }

  /**
   * 设置画布尺寸
   */
  protected setCanvasDimension(): void {
    const dpr = window.devicePixelRatio
    const width =
      getNumberValueOfStyle(this.container!, 'width') || defaultCanvasWidth
    const height =
      getNumberValueOfStyle(this.container!, 'height') || defaultCanvasHeight

    this.canvasWidth = width
    this.canvasHeight = height

    // 设置设备分辨率，防止在高清屏显示模糊（Mac OS）
    this.canvas.width = width * dpr
    this.canvas.height = height * dpr

    this.canvas.style.width = width + 'px'
    this.canvas.style.height = height + 'px'

    this.ctx.scale(dpr, dpr)
  }

  /**
   * 监听画布从 DOM 中被移除时，做后期清理操作，如销毁事件等
   */
  protected observeCanvasRemoved(): void {
    observeElementRemoved(this.canvas, () => {
      // 当 Canvas 从 DOM 中被移除
      // 1、停止 requestAnimationFrame，避免性能损耗
      this.isCanvasRemoved = true

      // 2、移除绑定事件
      if (this.resizeHandler) {
        window.removeEventListener('resize', this.resizeHandler)
      }

      // 3、触发销毁回调事件
      this.eventEmitter.trigger(EVENT_NAMES.DESTROY)

      // 4、移除所有事件
      this.eventEmitter.off()
    })
  }

  /**
   * 简单包装 window.requestAnimationFrame
   */
  protected requestAnimationFrame(): void {
    if (!this.isPaused && !this.isCanvasRemoved) {
      window.requestAnimationFrame(this.draw.bind(this))
    }
  }

  /**
   * 窗口尺寸调整事件
   */
  protected resizeEvent(): void {
    if (this.options.resize) {
      // 窗口尺寸改变处理函数，对应调整（粒子）位置
      this.resizeHandler = () => {
        const preCW = this.canvasWidth
        const preCH = this.canvasHeight

        // 重设画布尺寸
        this.setCanvasDimension()

        // 缩放比例
        const scaleX = this.canvasWidth / preCW
        const scaleY = this.canvasHeight / preCH

        // 通用处理逻辑，重新计算粒子坐标
        this.elements.forEach((element) => {
          if (isPlainObject(element)) {
            ;(element as GeneralElement).x *= scaleX
            ;(element as GeneralElement).y *= scaleY
          }
        })

        // 触发窗口缩放事件，可自定义更多逻辑
        this.eventEmitter.trigger(EVENT_NAMES.RESIZE, scaleX, scaleY)

        this.isPaused && this.draw()
      }
      window.addEventListener('resize', this.resizeHandler)
    }
  }

  /**
   * 暂停运动
   */
  pause(): void {
    if (this.isRunningSupported && !this.isCanvasRemoved && !this.isPaused) {
      this.isPaused = true
    }
  }

  /**
   * 开启运动
   */
  open(): void {
    if (this.isRunningSupported && !this.isCanvasRemoved && this.isPaused) {
      this.isPaused = false
      this.draw()
    }
  }

  /**
   * 当 Canvas 从 DOM 中移除时触发的销毁回调事件
   * @param args 参数集合
   */
  onDestroy(...args: (() => void)[]): this {
    this.eventEmitter.on(EVENT_NAMES.DESTROY, ...args)
    // 让事件支持链式操作
    return this
  }

  /**
   * 窗口尺寸改变时触发的回调事件
   * @param args 参数集合
   */
  onResize(...args: ((scaleX: number, scaleY: number) => void)[]): this {
    this.eventEmitter.on(EVENT_NAMES.RESIZE, ...args)
    // 让事件支持链式操作
    return this
  }
}
