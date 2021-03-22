import { isPlainObject } from '@src/utils/checking'

/**
 * 深拷贝，浅拷贝请使用 Object.assign 或 ECMAScript 扩展运算符
 * 1、API 参考 jQuery 深拷贝 https://api.jquery.com/jQuery.extend/#jQuery-extend-deep-target-object1-objectN
 * 2、数组合并采用替换方式，如
 *   merge({ a: [1, 2, 3] }, { a: [9, 8] }) => { a: [9, 8, 3] }
 */
export function merge<T extends any>(...objects: any[]): T {
  const length = objects.length
  const target = objects[0] || {}

  for (let i = 0; i < length; i++) {
    for (const prop in objects[i]) {
      const value = objects[i][prop]
      const copyIsArray = Array.isArray(value)

      if (copyIsArray || isPlainObject(value)) {
        let src = target[prop]

        if (copyIsArray) {
          src = Array.isArray(src) ? src : []
        } else {
          src = isPlainObject(src) ? src : {}
        }

        target[prop] = merge(src, value)
      } else {
        target[prop] = value
      }
    }
  }

  return target
}

/**
 * 加载图像
 * @param url 图像地址
 * @param successCallback 加载成功的回调函数
 * @param errorCallback 加载失败的回调函数
 */
export function loadImage(
  url: string,
  successCallback: (image: HTMLImageElement) => void,
  errorCallback?: (e: ErrorEvent) => void
): void {
  const image = new Image()
  image.addEventListener('load', () => successCallback(image))
  image.addEventListener('error', (e) => errorCallback?.(e))
  image.src = url
}
