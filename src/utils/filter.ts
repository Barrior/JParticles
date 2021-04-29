import { isFilterSupported } from '../common/constants'

export function grayscale(image: CanvasImageSource): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  const width = image!.width as number
  const height = image!.height as number

  canvas.width = width
  canvas.height = height

  if (isFilterSupported) {
    ctx.filter = 'grayscale(100%)'
  }

  ctx.drawImage(image, 0, 0, width, height, 0, 0, width, height)

  if (!isFilterSupported) {
    const pixels = ctx.getImageData(0, 0, width, height)
    const data = pixels.data
    const length = data.length

    for (let i = 0; i < length; i += 4) {
      // https://blog.csdn.net/u011835903/article/details/77742880/
      const brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2]
      data[i] = brightness
      data[i + 1] = brightness
      data[i + 2] = brightness
    }

    ctx.putImageData(pixels, 0, 0, 0, 0, width, height)
  }

  return canvas
}
