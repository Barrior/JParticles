import Base from '@src/common/base'
import { doublePi, regExp } from '@src/common/constants'
import type { CommonConfig } from '@src/types/common-config'
import type { ValueOf } from '@src/types/utility-types'
import { isArray, isString, loadImage } from '@src/utils'

const validShapeTypes = ['circle', 'triangle', 'star', 'image'] as const

export type NormalShapeType = Exclude<ValueOf<typeof validShapeTypes>, 'image'>

// 当为 string 时，解析为以下格式
//   1. `star:[边数][凹值]`, 示例：`star:5:0.5`, 表示五角星
//   2. 图片 HTTP 地址，示例：`https://xxx.com/a.jpg`
//   3. 图片 Base64 格式，示例：`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA`
export type ShapeType = NormalShapeType | string | CanvasImageSource

export interface ShapeData {
  // 形状类型
  type: ValueOf<typeof validShapeTypes>
  // 当为图片类型时，图片加载完毕的源文件
  source?: CanvasImageSource
  // 当为图片类型时，图片是否加载完毕
  isImageLoaded?: boolean
  // 当为 star 类型时，星形的边数
  sides?: number
  // 当为 star 类型时，星形的凹值
  dent?: number
}

/**
 * 生成形状数据
 * @param shape 形状类型
 */
function generateShapeData(shape: ShapeType): ShapeData {
  if (isString(shape)) {
    // 处理「圆形」和「三角形」
    if (shape === 'circle' || shape === 'triangle') {
      return { type: shape }
    }

    // 处理「星形」，默认五角星
    if (regExp.shapeStar.test(shape as string)) {
      const result = (shape as string).split(':')
      return {
        type: 'star',
        sides: Number(result[1]) || 5,
        dent: Number(result[2]) || 0.5,
      }
    }

    // 处理「Base64 格式」或「HTTP 地址图片」
    if (
      regExp.http.test(shape as string) ||
      regExp.imageBase64.test(shape as string)
    ) {
      const dataRef: ShapeData = {
        type: 'image',
        isImageLoaded: false,
      }

      loadImage(shape as string, (image) => {
        dataRef.isImageLoaded = true
        dataRef.source = image
      })

      return dataRef
    }

    // 提示错误
    // eslint-disable-next-line no-console
    console.warn(`Shape value of ${shape} is invalid.`)
  }

  try {
    // 处理 CanvasImageSource 类型
    if (
      shape instanceof HTMLImageElement ||
      shape instanceof SVGImageElement ||
      shape instanceof HTMLVideoElement ||
      shape instanceof HTMLCanvasElement ||
      shape instanceof ImageBitmap ||
      shape instanceof OffscreenCanvas
    ) {
      return {
        type: 'image',
        isImageLoaded: true,
        source: shape,
      }
    }
  } catch (_err) {
    // eslint-disable-next-line no-console
    console.warn(
      'Your browser does not support [CanvasImageSource](https://developer.mozilla.org/en-US/docs/Web/API/CanvasImageSource), please upgrade it.'
    )
  }

  // 错误的数据：不显示
  return {
    type: 'image',
    isImageLoaded: false,
  }
}

/**
 * 绘制「星形」形状
 * https://programmingthomas.wordpress.com/2012/05/16/drawing-stars-with-html5-canvas/
 *
 * @param ctx 绘图环境
 * @param x 中心点 X 坐标
 * @param y 中心点 Y 坐标
 * @param r 半径
 * @param p 边数(number of points)
 * @param m 插入半径的分数
 */
function drawStar(
  ctx: CanvasRenderingContext2D,
  // 中心点 X 坐标
  x: number,
  // 中心点 Y 坐标
  y: number,
  // 半径
  r: number,
  // 边数(number of points)
  p: number,
  // 插入半径的分数
  m: number
) {
  ctx.translate(x, y)
  ctx.moveTo(0, 0 - r)
  for (let i = 0; i < p; i++) {
    ctx.rotate(Math.PI / p)
    ctx.lineTo(0, 0 - r * m)
    ctx.rotate(Math.PI / p)
    ctx.lineTo(0, 0 - r)
  }
}

export default abstract class Shape<Options> extends Base<Options> {
  // 扩展 mask 相关属性
  protected readonly options!: Options &
    CommonConfig & {
      shape?: ShapeType | ShapeType[]
    }

  /**
   * 获取形状数据
   */
  protected getShapeData(): ShapeData {
    const { shape } = this.options
    const defaultShapeData: ShapeData = { type: 'circle' }

    if (!shape) {
      return defaultShapeData
    }

    if (isArray(shape)) {
      const length = (shape as ShapeType[]).length
      if (length) {
        const value = (shape as ShapeType[])[Math.floor(Math.random() * length)]
        return generateShapeData(value)
      }
      return defaultShapeData
    }

    return generateShapeData(shape as ShapeType)
  }

  /**
   * 绘制形状
   */
  protected drawShape(data: {
    x: number
    y: number
    r: number
    color: string
    shape: ShapeData
  }): void {
    const { type, isImageLoaded, source, sides, dent } = data.shape

    if (validShapeTypes.indexOf(type) === -1) {
      return
    }

    this.ctx.save()

    if (type === 'image') {
      if (isImageLoaded) {
        const width = data.r * 2
        this.ctx.drawImage(
          source!,
          0,
          0,
          (source?.width as number) || width,
          (source?.height as number) || width,
          data.x - data.r,
          data.y - data.r,
          width,
          width
        )
      }
    } else {
      this.ctx.beginPath()

      switch (data.shape.type) {
        case 'circle':
          this.ctx.arc(data.x, data.y, data.r, 0, doublePi)
          break
        case 'triangle':
          drawStar(this.ctx, data.x, data.y, data.r, 3, 0.5)
          break
        case 'star':
          drawStar(this.ctx, data.x, data.y, data.r, sides!, dent!)
          break
      }

      this.ctx.fillStyle = data.color
      this.ctx.fill()
    }

    this.ctx.restore()
  }
}
