/**
 * 重新定义 parseInt 函数
 * TypeScript 定义 parseInt 第一个参数只能接受 string 类型，实际还可以接受 number 类型
 */
declare function parseInt(s: string | number, radix?: number): number

/**
 * 获取 interface 或（类）数组的值
 */
type ValueOf<T> = T extends ArrayLike<any> ? T[number] : T[keyof T]

/**
 * 添加 window 对象兼容属性
 */
interface Window {
  mozRequestAnimationFrame?: AnimationFrameProvider['requestAnimationFrame']
  WebKitMutationObserver?: MutationObserver
}
