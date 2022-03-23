import { orientationSupport } from '@src/common/constants'
import Shape from '@src/common/shape'
import type { IElement, Options } from '@src/types/particle'
import type { ValueOf } from '@src/types/utility-types'
import {
  calcQuantity,
  isElement,
  isNull,
  offset,
  pInt,
  randomInRange,
  randomSpeed,
} from '@src/utils'

export default class Particle extends Shape<Options> {
  static defaultConfig: Options = {
    // 粒子个数，默认为容器宽度的 0.12 倍
    // (0, 1) 显示为容器宽度相应倍数的个数，0 & [1, +∞) 显示具体个数
    // 0 是没有意义的
    num: 0.12,

    // 粒子最大半径(0, +∞)
    maxR: 2.4,

    // 粒子最小半径(0, +∞)
    minR: 0.6,

    // 粒子最大运动速度(0, +∞)
    maxSpeed: 1,

    // 粒子最小运动速度(0, +∞)
    minSpeed: 0.1,

    // 两点连线的最大值
    // 在 range 范围内的两点距离小于 proximity，则两点之间连线
    // (0, 1) 显示为容器宽度相应倍数的个数，0 & [1, +∞) 显示具体个数
    proximity: 0.2,

    // 定位点的范围，范围越大连线越多
    // 当 range 等于 0 时，不连线，相关值无效
    // (0, 1) 显示为容器宽度相应倍数的个数，0 & [1, +∞) 显示具体个数
    range: 0.2,

    // 线段的宽度
    lineWidth: 0.2,

    // 连线的形状
    // spider: 散开的蜘蛛状
    // cube: 合拢的立方体状
    lineShape: 'spider',

    // 改变定位点坐标的事件元素
    // null 表示 canvas 画布，或传入原生元素对象，如 document 等
    eventElem: null,

    // 视差效果 {boolean}
    parallax: false,

    // 定义粒子在视差图层里的层数及每层的层级大小，类似 css 里的 z-index。
    // 取值范围: [0, +∞)，值越小视差效果越强烈，0 则不动。
    // 定义四层粒子示例：[1, 3, 5, 10]
    parallaxLayer: [1, 2, 3],

    // 视差强度，值越小视差效果越强烈
    parallaxStrength: 3,
  }

  protected elements!: IElement[]

  // 定位点坐标 X
  private positionX?: number

  // 定位点坐标 Y
  private positionY?: number

  // 鼠标坐标 X
  private mouseX = 0

  // 鼠标坐标 Y
  private mouseY = 0

  // 线条形状生成器
  private lineShapeMaker?: (
    // 粒子 x 坐标
    x: number,
    // 粒子 y 坐标
    y: number,
    // 兄弟粒子 x 坐标
    sx: number,
    // 兄弟粒子 y 坐标
    sy: number,
    // 回调函数
    cb: () => void
  ) => void

  constructor(selector: string | HTMLElement, options?: Partial<Options>) {
    super(Particle.defaultConfig, selector, options)
    this.bootstrap()
  }

  /**
   * 初始化数据和运行程序
   */
  protected init(): void {
    this.ownResizeEvent()
    this.optionsNormalize()

    if (this.options.range > 0) {
      // 定位点坐标
      this.positionX = Math.random() * this.canvasWidth
      this.positionY = Math.random() * this.canvasHeight
      this.defineLineShape()
      this.positionEvent()
    }

    // 初始化鼠标在视差上的坐标
    this.mouseX = this.mouseY = 0
    this.parallaxEvent()

    // 创建粒子
    this.createDots()
  }

  /**
   * 标准化配置参数，参考 calcQuantity 方法描述。
   * 如:
   *   num: 0.5  =>  表示 0.5 倍画布宽度  =>  标准化为具体数值，如 100
   *   num: 100  =>  表示具体数值  => 标准化结果还是 100
   */
  private optionsNormalize(): void {
    const { canvasWidth, options } = this
    const props = ['num', 'proximity', 'range'] as const

    props.forEach((prop: ValueOf<typeof props>) => {
      options[prop] = pInt(calcQuantity(options[prop], canvasWidth))
    })

    // 设置触发事件的元素
    if (!isElement(options.eventElem) && options.eventElem !== document) {
      options.eventElem = this.canvas
    }
  }

  /**
   * 根据配置参数生成对应形状的连线函数
   */
  private defineLineShape(): void {
    const { proximity, range, lineShape } = this.options
    switch (lineShape) {
      case 'cube':
        this.lineShapeMaker = (x, y, sx, sy, cb) => {
          const { positionX, positionY } = this
          if (
            Math.abs(x - sx) <= proximity &&
            Math.abs(y - sy) <= proximity &&
            Math.abs(x - positionX!) <= range &&
            Math.abs(y - positionY!) <= range &&
            Math.abs(sx - positionX!) <= range &&
            Math.abs(sy - positionY!) <= range
          ) {
            cb()
          }
        }
        break
      default:
        this.lineShapeMaker = (x, y, sx, sy, cb) => {
          const { positionX, positionY } = this
          if (
            Math.abs(x - sx) <= proximity &&
            Math.abs(y - sy) <= proximity &&
            ((Math.abs(x - positionX!) <= range &&
              Math.abs(y - positionY!) <= range) ||
              (Math.abs(sx - positionX!) <= range &&
                Math.abs(sy - positionY!) <= range))
          ) {
            cb()
          }
        }
    }
  }

  /**
   * 根据配置参数创建许多粒子（纯数据）
   * 最后通过 draw 函数绘制真实可见的图形
   */
  private createDots(): void {
    const { canvasWidth, canvasHeight, getColor } = this
    const { maxR, minR, maxSpeed, minSpeed, parallaxLayer } = this.options
    const layerLength = parallaxLayer.length
    let { num } = this.options

    while (num--) {
      const r = randomInRange(maxR, minR)
      this.elements.push({
        r,
        x: randomInRange(canvasWidth - r, r),
        y: randomInRange(canvasHeight - r, r),
        vx: randomSpeed(maxSpeed, minSpeed),
        vy: randomSpeed(maxSpeed, minSpeed),
        color: getColor(),
        shape: this.getShapeData(),
        // 定义粒子在视差图层里的层数及每层的层级大小
        parallaxLayer: parallaxLayer[Math.floor(Math.random() * layerLength)],
        // 定义粒子视差的偏移值
        parallaxOffsetX: 0,
        parallaxOffsetY: 0,
      })
    }
  }

  /**
   * 绘制粒子
   */
  protected draw(): void {
    const { ctx } = this
    const { lineWidth } = this.options

    this.clearCanvasAndSetGlobalAttrs()

    // 当 canvas 宽高改变的时候，全局属性需要重新设置
    ctx.lineWidth = lineWidth

    // 更新粒子坐标
    this.updateXY()

    // 绘制粒子
    this.elements.forEach((dot) => {
      const { x, y, parallaxOffsetX, parallaxOffsetY } = dot
      this.drawShape({
        ...dot,
        x: x + parallaxOffsetX,
        y: y + parallaxOffsetY,
      })
    })

    // 连接粒子
    this.connectDots()

    // 循环绘制
    this.requestAnimationFrame()
  }

  /**
   * 连接粒子，绘制线段
   */
  private connectDots(): void {
    // 当连接范围小于 0 时，不连接线段
    if (this.options.range <= 0) return

    const { elements, ctx, lineShapeMaker } = this
    const length = elements.length

    elements.forEach((dot, i) => {
      const x = dot.x + dot.parallaxOffsetX
      const y = dot.y + dot.parallaxOffsetY

      while (++i < length) {
        const sibDot = elements[i]
        const sx = sibDot.x + sibDot.parallaxOffsetX
        const sy = sibDot.y + sibDot.parallaxOffsetY

        lineShapeMaker?.(x, y, sx, sy, () => {
          ctx.save()
          ctx.beginPath()
          ctx.moveTo(x, y)
          ctx.lineTo(sx, sy)
          ctx.strokeStyle = dot.color
          ctx.stroke()
          ctx.restore()
        })
      }
    })
  }

  /**
   * 更新粒子坐标
   */
  private updateXY(): void {
    const { isPaused, mouseX, mouseY, canvasWidth, canvasHeight } = this
    const { parallax, parallaxStrength } = this.options

    // 暂停的时候，vx 和 vy 保持不变，
    // 防止自适应窗口变化时出现粒子移动
    if (isPaused) return

    this.elements.forEach((dot) => {
      if (parallax) {
        // https://github.com/jnicol/particleground/blob/master/jquery.particleground.js#L279-L282
        const divisor = parallaxStrength * dot.parallaxLayer
        dot.parallaxOffsetX += (mouseX / divisor - dot.parallaxOffsetX) / 10
        dot.parallaxOffsetY += (mouseY / divisor - dot.parallaxOffsetY) / 10
      }

      dot.x += dot.vx
      dot.y += dot.vy

      const { r, parallaxOffsetX, parallaxOffsetY } = dot
      let { x, y } = dot
      x += parallaxOffsetX
      y += parallaxOffsetY

      // 自然碰撞反向，视差事件移动反向
      if (x + r >= canvasWidth) {
        dot.vx = -Math.abs(dot.vx)
      } else if (x - r <= 0) {
        dot.vx = Math.abs(dot.vx)
      }

      if (y + r >= canvasHeight) {
        dot.vy = -Math.abs(dot.vy)
      } else if (y - r <= 0) {
        dot.vy = Math.abs(dot.vy)
      }
    })
  }

  /**
   * 获取绑定的 DOM 元素（eventElem）的 offset 值
   */
  private getEventElemOffset(): null | { left: number; top: number } {
    const { eventElem } = this.options
    return eventElem === document ? null : offset(eventElem as HTMLElement)
  }

  /**
   * 事件代理
   * @param move  移动事件处理函数
   * @param orientation  陀螺仪事件处理函数
   */
  private eventProxy(
    move: (left: number, top: number) => void,
    orientation: (beta: number, gamma: number) => void
  ): void {
    const { eventElem } = this.options
    let handleOrientation: (e: DeviceOrientationEvent) => void

    if (orientationSupport) {
      handleOrientation = (e) => {
        if (this.isPaused || isNull(e.beta)) return

        // 转换 beta 范围 [-180, 180] 成 [-90, 90]
        orientation(Math.min(Math.max(e.beta!, -90), 90), e.gamma!)
      }

      window.addEventListener('deviceorientation', handleOrientation)
    }

    const handleMove = (e: MouseEvent) => {
      if (this.isPaused) return

      let left = e.pageX
      let top = e.pageY

      const offset = this.getEventElemOffset()
      if (offset) {
        left -= offset.left
        top -= offset.top
      }
      move(left, top)
    }

    eventElem!.addEventListener('mousemove', handleMove as EventListener)

    // 实例销毁时移除绑定的事件
    this.onDestroy(() => {
      window.removeEventListener('deviceorientation', handleOrientation)
      eventElem!.removeEventListener('mousemove', handleMove as EventListener)
    })
  }

  /**
   * 鼠标位置事件，根据鼠标的坐标将范围内的粒子连接起来
   */
  private positionEvent(): void {
    const { range } = this.options

    // 性能优化
    if (range > this.canvasWidth && range > this.canvasHeight) return

    this.eventProxy(
      // 鼠标移动事件
      (left, top) => {
        this.positionX = left
        this.positionY = top
      },
      // 陀螺仪事件
      (beta, gamma) => {
        this.positionX = (-(gamma - 90) / 180) * this.canvasWidth
        this.positionY = (-(beta - 90) / 180) * this.canvasHeight
      }
    )
  }

  /**
   * 视差效果事件
   */
  private parallaxEvent(): void {
    if (!this.options.parallax) return

    this.eventProxy(
      (left, top) => {
        this.mouseX = left - this.canvasWidth / 2
        this.mouseY = top - this.canvasHeight / 2
      },
      (beta, gamma) => {
        // 一半高度或宽度的对应比例值
        // mouseX: - gamma / 90 * canvasWidth / 2;
        // mouseY: - beta / 90 * canvasHeight / 2;
        this.mouseX = (-gamma * this.canvasWidth) / 180
        this.mouseY = (-beta * this.canvasHeight) / 180
      }
    )
  }

  /**
   * 窗口尺寸调整事件
   */
  private ownResizeEvent(): void {
    this.onResize((scaleX, scaleY) => {
      if (this.options.range > 0) {
        this.positionX! *= scaleX
        this.positionY! *= scaleY
        this.mouseX *= scaleX
        this.mouseY *= scaleY
      }
    })
  }
}
