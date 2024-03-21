/**
 * 获取 interface 或（类）数组的值
 */
export type ValueOf<T> = T extends ArrayLike<unknown> ? T[number] : T[keyof T]

/**
 * 排除没有 width 和 height 属性的元素
 */
export type ICanvasImageSource = Exclude<CanvasImageSource, SVGImageElement>
