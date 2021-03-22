import { isFunction } from '@src/utils'

/**
 * 事件机制，类似 NodeJS Events 模块
 * 使用文档参考 https://taro-docs.jd.com/taro/docs/apis/about/events/
 */
export default class Events {
  private listenerMap: {
    [eventName: string]: Function[]
  } = {}

  /**
   * 绑定事件
   * @param eventName 事件名称
   * @param listeners 监听函数
   */
  on(eventName: string, ...listeners: Function[]): this {
    if (!this.listenerMap[eventName]) {
      this.listenerMap[eventName] = []
    }

    for (const listener of listeners) {
      if (isFunction(listener)) {
        this.listenerMap[eventName].push(listener)
      }
    }

    return this
  }

  /**
   * 取消事件
   * @param eventName 事件名称
   * @param listener 监听函数
   */
  off(eventName?: string, listener?: Function): this {
    if (!eventName) {
      // 移除所有事件
      this.listenerMap = {}
      return this
    }

    if (!listener) {
      // 移除事件名称所有事件
      this.listenerMap[eventName] = []
      return this
    }

    // 移除事件名称特定事件
    const container = this.listenerMap[eventName]
    const index = container.indexOf(listener)
    if (index !== -1) {
      container.splice(index, 1)
    }

    return this
  }

  /**
   * 触发事件
   * @param eventName 事件名称
   * @param args 参数
   */
  trigger(eventName: string, ...args: any[]): this {
    const listeners = this.listenerMap[eventName]
    if (Array.isArray(listeners)) {
      listeners.forEach((listener) => {
        listener(...args)
      })
    }
    return this
  }
}
