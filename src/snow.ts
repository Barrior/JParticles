import Shape from '@src/common/shape'
import { IElement, Options } from '@src/types/snow'
import { randomInRange, randomSpeed } from '@src/utils'

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
    const vx = randomSpeed(maxSpeed, minSpeed)
    return {
      r,
      x: Math.random() * this.canvasWidth,
      y: -r,
      vx,
      vxFixed: Math.abs(vx),
      // 半径越大，垂直速度越快，这样比较有近快远慢的层次效果
      vy: 0.5 || Math.abs(r * randomSpeed(maxSpeed, minSpeed)),
      color: this.getColor(),
      shape: this.getShapeData(),
      isSwinging: false,
      swingAt: Date.now(),
      // 缓动效果值：0.01 或 -0.01
      swingValue: 0.01,
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

    if (isPaused) return

    this.clearCanvasAndSetGlobalAttrs()

    this.elements.forEach((snowflake, i, array) => {
      const { x, y, r, isSwinging } = snowflake

      this.drawShape(snowflake)

      if (x + r < 0 || x - r > canvasWidth) {
        // 雪花从侧边出去，删除再添加一个新的
        array.splice(i, 1, this.createSnowflake())
        // 跳过移除的雪花（不需要的计算）
        return
      }

      if (y - r > canvasHeight) {
        // 雪花从底部出去，删除
        array.splice(i, 1)
        // 跳过移除的雪花（不需要的计算）
        return
      }

      snowflake.x += snowflake.vx
      snowflake.y += snowflake.vy

      if (isSwinging) {
        if (Math.abs(snowflake.vx) > snowflake.vxFixed) {
          snowflake.isSwinging = false
          snowflake.vx = snowflake.vxFixed * snowflake.swingValue
          this.swingDetect(this.options, snowflake)
        } else {
          snowflake.vx += snowflake.swingValue
        }
      } else {
        this.swingDetect(this.options, snowflake)
      }
    })

    // 添加雪花
    if (Math.random() > 0.9) {
      this.createSnowflakes()
    }

    this.requestAnimationFrame()
  }

  /**
   * 变换飘落方向，根据一定的几率
   */
  private swingDetect(options: Options, snowflake: IElement) {
    if (
      options.swing &&
      // 变换的时间超过一定的时间
      Date.now() - snowflake.swingAt > options.swingInterval &&
      // 半径越小，变换几率越小
      Math.random() < (snowflake.r / options.maxR) * options.swingProbability
    ) {
      snowflake.isSwinging = true
      snowflake.swingAt = Date.now()
      snowflake.swingValue *= -1
    }
  }
}
