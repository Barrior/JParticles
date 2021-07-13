export const piBy180 = Math.PI / 180
export const doublePi = Math.PI * 2
export const orientationSupport = !!window.DeviceOrientationEvent
export const funcToString = Function.prototype.toString
export const objectCtorString = funcToString.call(Object)
export const defaultCanvasWidth = 485
export const defaultCanvasHeight = 300
export const isIE8 = /msie\s8.0/i.test(navigator.userAgent)
export const isRuntimeSupported = !!Object.defineProperty && !isIE8

// 正则列表
export const regExp = {
  // 匹配任意空白
  trimAll: /\s/g,

  // 匹配 HTTP 协议
  http: /^(https?:\/\/|\/\/)/i,

  // 匹配 'star' 或 'star:5:0.5'
  shapeStar: /^star(:\d+:\d+(\.\d+)?)?$/,

  // 匹配 Base64 图片
  imageBase64: /^data:image\/(png|jpe?g|gif|svg\+xml);base64,/,
}

// 公共事件名列表
export enum EVENT_NAMES {
  DESTROY = 'DESTROY',
  RESIZE = 'RESIZE',
}

// 事件名列表
export enum EVENT_NAMES_WAVE_LOADING {
  PROGRESS = 'PROGRESS',
  FINISHED = 'FINISHED',
}
