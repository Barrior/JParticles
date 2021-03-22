import Base from '@src/common/base'
import { doublePi } from '@src/common/constants'
import { IElement, Options } from '@src/types/snow'
import { pInt, randomInRange, randomSpeed } from '@src/utils'

export default class Snow extends Base<Options> {
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
    return {
      r,
      x: Math.random() * this.canvasWidth,
      y: -r,
      vx: randomSpeed(maxSpeed, minSpeed),
      // 半径越大，垂直速度越快，这样比较有近快远慢的层次效果
      vy: Math.abs(r * randomSpeed(maxSpeed, minSpeed)),
      color: this.getColor(),
      swingAt: Date.now(),
    }
  }

  /**
   * 随机创建雪花
   */
  private createSnowflakes(): void {
    let count = Math.max(0, pInt(Math.random() * this.options.num))
    while (count--) {
      this.elements.push(this.createSnowflake())
    }
  }

  /**
   * 绘图
   */
  protected draw(): void {
    const { ctx, canvasWidth, canvasHeight, isPaused } = this
    const { maxR, swing, swingInterval, swingProbability } = this.options

    this.clearCanvasAndSetGlobalAttrs()

    this.elements.forEach((snowflake, i, array) => {
      const { x, y, r } = snowflake

      ctx.save()
      ctx.beginPath()
      ctx.arc(x, y, r, 0, doublePi)
      ctx.fillStyle = snowflake.color
      ctx.fill()
      ctx.restore()

      if (!isPaused) {
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

        if (x < 0 || x - r > canvasWidth) {
          // 雪花从侧边出去，删除再添加一个
          array.splice(i, 1, this.createSnowflake())
        } else if (y - r > canvasHeight) {
          // 雪花从底部出去，删除
          array.splice(i, 1)
        }
      }
    })

    // 添加雪花
    if (!isPaused && Math.random() > 0.9) {
      this.createSnowflakes()
    }

    this.requestAnimationFrame()
  }
}
