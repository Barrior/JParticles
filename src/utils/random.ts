/**
 * 在指定范围内获取随机数
 */
export function randomInRange(max: number, min: number): number {
  return max === min ? max : Math.random() * (max - min) + min
}

/**
 * 获取随机速度，取最大或最小速度之间的随机值，并随机赋予正负值
 */
export function randomSpeed(maxSpeed: number, minSpeed: number): number {
  return (
    (randomInRange(maxSpeed, minSpeed) || maxSpeed) *
    (Math.random() > 0.5 ? 1 : -1)
  )
}

/**
 * 获取随机颜色值，返回 16 进制色值
 */
export function randomColor(): string {
  // http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
  // prettier-ignore
  return `#${Math.random().toString(16).slice(-6)}`
}
