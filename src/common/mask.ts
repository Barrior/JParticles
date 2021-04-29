import Base from '@src/common/base'
import Cache from '@src/common/cache'
import { CommonConfig } from '@src/types/common-config'
import { grayscale, isString, loadImage, upperFirst } from '@src/utils'

export type modeMethodNames = 'modeNormal' | 'modeGhost'

export default abstract class Mask<Options> extends Base<Options> {
  // 遮罩图像对象
  protected maskImage?: CanvasImageSource

  // 扩展 mask 相关属性
  protected readonly options!: Options &
    CommonConfig & {
      mask?: string | CanvasImageSource
      maskMode?: 'normal' | 'ghost'
    }

  // 已经加载成功的图像列表
  private completedMap: {
    [key: string]: HTMLImageElement
  } = {}

  protected grayImageCache = new Cache()

  /**
   * 加载遮罩图像
   * @TODO 加载错误重试
   */
  protected loadMaskImage(): void {
    const mask = this.options.mask

    if (!mask) return

    if (isString(mask)) {
      // 取缓存图像
      if (this.completedMap[mask as string]) {
        this.maskImage = this.completedMap[mask as string]
        return
      }

      loadImage(mask as string, (image) => {
        this.completedMap[mask as string] = image
        this.maskImage = image
      })
    } else {
      this.maskImage = mask as CanvasImageSource
    }
  }

  protected renderMaskMode(mainDrawing: () => void): void {
    if (!this.maskImage) {
      mainDrawing()
      return
    }

    const modeName = this.options.maskMode || 'normal'
    this.ctx.save()
    this[`mode${upperFirst(modeName)}` as modeMethodNames](mainDrawing)
    this.ctx.restore()
  }

  /**
   * 常规遮罩或无遮罩模式
   */
  private modeNormal(mainDrawing: () => void): void {
    this.drawMaskImage()

    // 设置图形组合模式，将效果映射到遮罩内
    this.ctx.globalCompositeOperation = 'source-atop'

    mainDrawing()
  }

  /**
   * 幽灵遮罩模式：
   *   1、用遮罩图片生成灰色背景
   *   2、用波纹 clip 出原始遮罩图片
   */
  private modeGhost(mainDrawing: () => void): void {
    // 绘制灰色背景
    const originWidth = this.maskImage!.width as number
    const originHeight = this.maskImage!.height as number
    const grayImage = grayscale(this.maskImage!)
    const { x, y, width, height } = this.getMaskImagePosition()
    this.ctx.drawImage(
      grayImage,
      0,
      0,
      originWidth,
      originHeight,
      x,
      y,
      width,
      height
    )

    // 设置图形组合模式，将效果映射到遮罩内
    this.ctx.globalCompositeOperation = 'source-atop'

    // 绘制原始图案
    mainDrawing()
    this.ctx.clip()
    this.ctx.drawImage(
      this.maskImage!,
      0,
      0,
      originWidth,
      originHeight,
      x,
      y,
      width,
      height
    )
  }

  /**
   * 绘制遮罩图案
   */
  protected drawMaskImage() {
    const {
      x,
      y,
      width,
      height,
      originWidth,
      originHeight,
    } = this.getMaskImagePosition()
    this.ctx.drawImage(
      this.maskImage!,
      0,
      0,
      originWidth,
      originHeight,
      x,
      y,
      width,
      height
    )
  }

  /**
   * 遮罩图像填充模式为 contain 且居中
   */
  protected getMaskImagePosition(): {
    x: number
    y: number
    width: number
    height: number
    originWidth: number
    originHeight: number
  } {
    const { canvasWidth, canvasHeight, maskImage } = this
    const originWidth = maskImage!.width as number
    const originHeight = maskImage!.height as number
    const imgScale = originWidth / originHeight

    // 图像填充算法: contain 模式
    let width = originWidth > canvasWidth ? canvasWidth : originWidth
    let height = originHeight > canvasHeight ? canvasHeight : originHeight

    if (originWidth > originHeight) {
      height = width / imgScale
    } else {
      width = height * imgScale
    }

    // 居中处理
    const x = (canvasWidth - width) / 2
    const y = (canvasHeight - height) / 2

    return { x, y, width, height, originWidth, originHeight }
  }
}
