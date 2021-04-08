import { DeprecatedOptions } from '@src/types/decorators'
import { isFunction, isString } from '@src/utils'

/**
 * 注入事件链：允许事件链式操作
 */
export function injectEventChain<T>() {
  return function (
    _target: T,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value

    descriptor.value = function (...args: any[]): T {
      originalMethod.apply(this, args)
      return this as T
    }

    return descriptor
  }
}

/**
 * 废弃 API 运行时提示
 */
export function deprecated(options?: string | DeprecatedOptions) {
  options = (isString(options)
    ? { alternative: options }
    : options) as DeprecatedOptions

  let message = options?.alternative
    ? `please use \`${options.alternative}\` instead.`
    : ''

  if (options?.url) {
    message += ` Check out ${options.url} for more information.`
  }

  return function (
    _target: unknown,
    key: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalValue = descriptor.value

    if (isFunction(originalValue)) {
      descriptor.value = function (...args: any[]) {
        // eslint-disable-next-line prettier/prettier
        const foreword = `Warning: Method \`${String(key)}\` has been deprecated`

        // eslint-disable-next-line no-console
        console.warn(foreword + (message ? ', ' + message : '.'))

        originalValue.apply(this, args)
      }
    }

    return descriptor
  }
}
