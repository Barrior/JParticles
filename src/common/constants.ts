export const piBy180 = Math.PI / 180
export const doublePi = Math.PI * 2
export const orientationSupport = !!window.DeviceOrientationEvent
export const funcToString = Function.prototype.toString
export const objectCtorString = funcToString.call(Object)
export const defaultCanvasWidth = 485
export const defaultCanvasHeight = 300
export const isIE8 = /msie\s8.0/i.test(navigator.userAgent)
export const isRuntimeSupported = Object.defineProperty && !isIE8

// 正则列表
export const regExp = {
  trimAll: /\s/g,
  http: /^(https?|\/\/)/i,
}

// 事件名列表
export enum EVENT_NAMES {
  DESTROY = 'DESTROY',
}

// 事件名列表
export enum EVENT_NAMES_WAVE_LOADING {
  PROGRESS = 'PROGRESS',
  FINISHED = 'FINISHED',
}
