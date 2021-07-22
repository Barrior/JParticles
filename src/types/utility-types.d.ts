/**
 * 获取 interface 或（类）数组的值
 */
export type ValueOf<T> = T extends ArrayLike<unknown> ? T[number] : T[keyof T]
