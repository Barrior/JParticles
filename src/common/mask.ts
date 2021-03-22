import Base from '@src/common/base'
import { CommonConfig } from '@src/types/common-config'
import { loadImage, upperFirst } from '@src/utils'

export type modeMethodNames = 'modeNormal' | 'modeGhost'

export default abstract class Mask<Options> extends Base<Options> {
  // 遮罩图像对象
  protected maskImage?: HTMLImageElement

  // 扩展 mask 相关属性
  protected readonly options!: Options &
    CommonConfig & {
      mask?: string
      maskMode?: 'normal' | 'ghost'
    }

  // 已经加载成功的图像列表
  private completedMap: {
    [key: string]: HTMLImageElement
  } = {}

  /**
   * 加载遮罩图像
   * @TODO 加载错误重试
   */
  protected loadMaskImage(): void {
    const maskUrl = this.options.mask

    if (!maskUrl) return

    // 取缓存图像
    if (this.completedMap[maskUrl]) {
      this.maskImage = this.completedMap[maskUrl]
      return
    }

    loadImage(maskUrl, (image) => {
      this.completedMap[maskUrl] = image
      this.maskImage = image
    })
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
    this.ctx.save()
    this.ctx.filter = 'grayscale(100%)'
    this.drawMaskImage()
    this.ctx.restore()

    // 设置图形组合模式，将效果映射到遮罩内
    this.ctx.globalCompositeOperation = 'source-atop'

    // 绘制原始图案
    mainDrawing()
    this.ctx.clip()
    this.drawMaskImage()
  }

  /**
   * 绘制遮罩图案，遮罩图像填充模式为 contain 且居中
   */
  protected drawMaskImage(): void {
    if (!this.maskImage) return

    const { ctx, canvasWidth, canvasHeight, maskImage } = this
    const { naturalWidth, naturalHeight } = maskImage
    const imgScale = naturalWidth / naturalHeight

    // 图像填充算法: contain 模式
    let width = naturalWidth > canvasWidth ? canvasWidth : naturalWidth
    let height = naturalHeight > canvasHeight ? canvasHeight : naturalHeight

    if (naturalWidth > naturalHeight) {
      height = width / imgScale
    } else {
      width = height * imgScale
    }

    // 居中处理
    const x = (canvasWidth - width) / 2
    const y = (canvasHeight - height) / 2

    ctx.drawImage(
      maskImage,
      0,
      0,
      naturalWidth,
      naturalHeight,
      x,
      y,
      width,
      height
    )
  }
}
