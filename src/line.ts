import Base from '@src/common/base'
import { IElement, Options } from '@src/types/line'
import {
  degreesToRadians,
  offset,
  randomInRange,
  randomSpeed,
  toFixed,
} from '@src/utils'

export default class Line extends Base<Options> {
  static defaultConfig: Options = {
    num: 6,
    maxWidth: 2,
    minWidth: 1,
    maxSpeed: 3,
    minSpeed: 1,
    maxDegree: 90,
    minDegree: 80,
    createOnClick: true,
    numberOfCreations: 3,
    removeOnOverflow: true,
    overflowCompensation: 20,
    reservedLines: 6,
  }

  protected elements!: IElement[]

  // 特殊角度
  private specificAngles = [-180, -90, 0, 90, 180]

  constructor(selector: string | HTMLElement, options?: Partial<Options>) {
    super(Line.defaultConfig, selector, options)
    this.bootstrap()
  }

  /**
   * 初始化数据和运行程序
   */
  protected init(): void {
    this.createLines(this.options.num)
    this.createLinesOnClick()
  }

  /**
   * 创建设定数量的线条
   * @param number 数量
   * @param positionX 线条的 x 坐标，没有则随机
   */
  private createLines(number: number, positionX?: number): void {
    const {
      maxWidth,
      minWidth,
      maxSpeed,
      minSpeed,
      maxDegree,
      minDegree,
    } = this.options

    while (number--) {
      this.elements.push({
        x: positionX ?? Math.random() * this.canvasWidth,
        width: randomInRange(maxWidth, minWidth),
        color: this.getColor(),
        speed: randomSpeed(maxSpeed, minSpeed),
        // 限制角度取值范围为 [-180, 180]
        degree: toFixed(randomInRange(maxDegree, minDegree) % 180),
      })
    }
  }

  /**
   * 点击的时候创建线条
   */
  private createLinesOnClick(): void {
    if (!this.options.createOnClick) return

    const handleClick = (event: MouseEvent) => {
      if (this.isPaused) return
      const x = event.pageX - offset(this.canvas).left
      this.createLines(this.options.numberOfCreations, x)
    }

    this.canvas.addEventListener('click', handleClick)

    this.onDestroy(() => {
      this.canvas.removeEventListener('click', handleClick)
    })
  }

  protected draw(): void {
    const { ctx, canvasWidth, canvasHeight } = this
    const {
      removeOnOverflow,
      overflowCompensation,
      reservedLines,
    } = this.options

    this.clearCanvasAndSetGlobalAttrs()

    // 以 Canvas 三角形计算出来的最长边的 10 倍长度作为线段的半长
    const hypotenuse = Math.hypot(canvasWidth, canvasHeight)
    const lineLength = hypotenuse * 10

    // 溢出补偿
    const OC = Math.max(0, overflowCompensation)

    this.elements.forEach((line, i) => {
      // 逆时针表示，3 点钟方向表示 0 度，12 点钟方向表示 90 度（即垂直），9 点钟方向表示 180 度。
      const radian = degreesToRadians(-line.degree)

      // 可视区内角度邻边的长度
      let adjacentSide = 0
      if (!this.specificAngles.includes(line.degree)) {
        adjacentSide = Math.abs(this.canvasHeight / 2 / Math.tan(radian))
      }

      ctx.save()
      ctx.beginPath()

      // 通过 translate 将线段移动到指定位置
      ctx.translate(line.x, this.canvasHeight / 2)
      ctx.rotate(radian)

      // 在 (0, 0) 位置横向描绘线段
      ctx.moveTo(-lineLength, 0)
      ctx.lineTo(lineLength, 0)

      // 设置线条宽度和颜色
      ctx.lineWidth = line.width
      ctx.strokeStyle = line.color

      ctx.stroke()
      ctx.closePath()
      ctx.restore()

      if (!this.isPaused) {
        line.x += line.speed
      }

      let isOverflow = false
      let isOverflowOnLeft = false

      // 溢出补偿，让溢出多偏移一点才反向
      if (line.x + adjacentSide + line.width + OC < 0) {
        isOverflow = true
        isOverflowOnLeft = true
      } else if (line.x > this.canvasWidth + adjacentSide + line.width + OC) {
        isOverflow = true
      }

      if (isOverflow) {
        if (removeOnOverflow && this.elements.length > reservedLines) {
          // 溢出移除
          this.elements.splice(i, 1)
        } else {
          // 溢出反向
          line.speed = Math.abs(line.speed) * (isOverflowOnLeft ? 1 : -1)
        }
      }
    })

    this.requestAnimationFrame()
  }
}
