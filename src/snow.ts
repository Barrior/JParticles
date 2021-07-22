import Shape from '@src/common/shape'
import { IElement, Options } from '@src/types/snow'
import { randomInRange, randomSpeed } from '@src/utils'

import { EVENT_NAMES_SNOW } from './common/constants'

export default class Snow extends Shape<Options> {
  static defaultConfig: Options = {
    num: 6,
    color: '#fff',
    maxR: 6.5,
    minR: 0.5,
    maxSpeed: 0.6,
    minSpeed: 0.1,
    swing: true,
    swingInterval: 2000,
    swingProbability: 0.06,
  }

  protected elements!: IElement[]

  // 下雪的开始时间
  startTime = Date.now()

  constructor(selector: string | HTMLElement, options?: Partial<Options>) {
    super(Snow.defaultConfig, selector, options)
    this.bootstrap()
  }

  /**
   * 初始化数据和运行程序
   */
  protected init(): void {
    this.createSnowflakes()
  }

  /**
   * 创建单个雪花，包含大小、位置、速度等信息
   */
  private createSnowflake(): IElement {
    const { maxR, minR, maxSpeed, minSpeed } = this.options
    const r = randomInRange(maxR, minR)
    return {
      r,
      x: Math.random() * this.canvasWidth,
      y: -r,
      vx: randomSpeed(maxSpeed, minSpeed),
      // 半径越大，垂直速度越快，这样比较有近快远慢的层次效果
      vy: Math.abs(r * randomSpeed(maxSpeed, minSpeed)),
      color: this.getColor(),
      swingAt: Date.now(),
      shape: this.getShapeData(),
    }
  }

  /**
   * 随机创建雪花
   */
  private createSnowflakes(): void {
    let count = Math.max(0, Math.ceil(Math.random() * this.options.num))
    while (count--) {
      this.elements.push(this.createSnowflake())
    }
  }

  /**
   * 绘图
   */
  protected draw(): void {
    const { canvasWidth, canvasHeight, isPaused } = this
    const { maxR, swing, swingInterval, swingProbability, duration } =
      this.options

    if (isPaused) {
      return
    }

    this.clearCanvasAndSetGlobalAttrs()

    this.elements.forEach((snowflake, i, array) => {
      const { x, y, r } = snowflake

      this.drawShape(snowflake)

      snowflake.x += snowflake.vx
      snowflake.y += snowflake.vy

      // 变换飘落方向，根据一定的几率
      if (
        swing &&
        Date.now() - snowflake.swingAt > swingInterval &&
        // 半径越小，变换几率越小
        Math.random() < (r / maxR) * swingProbability
      ) {
        snowflake.swingAt = Date.now()
        snowflake.vx *= -1
      }

      if (x + r < 0 || x - r > canvasWidth) {
        // 雪花从侧边出去 => 删除
        // 有持续时间 ? 不添加 : 添加一个新雪花
        duration
          ? array.splice(i, 1)
          : array.splice(i, 1, this.createSnowflake())
      } else if (y - r > canvasHeight) {
        // 雪花从底部出去 => 删除
        array.splice(i, 1)
      }
    })

    // 当有 duration 参数时，判断持续时间是否用完
    // 没有 duration 参数时，一直可用
    const timeEnd = duration ? Date.now() - this.startTime > duration : false

    if (!timeEnd && Math.random() > 0.9) {
      // 添加雪花
      this.createSnowflakes()
    }

    if (this.elements.length) {
      this.requestAnimationFrame()
    } else {
      this.eventEmitter.trigger(EVENT_NAMES_SNOW.FINISHED)
    }
  }

  /**
   * 事件：存在持续时间时，雪花全部降落完后触发的事件
   */
  onFinished(...args: Array<() => void>): this {
    this.eventEmitter.on(EVENT_NAMES_SNOW.FINISHED, ...args)
    return this
  }
}
