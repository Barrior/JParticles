import { isElement, isString } from './checking'
import { pInt } from './str-num'

/**
 * 获取 DOM 元素数值类型的样式并返回取整后的数值
 * @param elem  DOM 元素
 * @param attr  CSS 属性
 */
export function getNumberValueOfStyle(
  elem: HTMLElement,
  attr: keyof CSSStyleDeclaration
): number | void {
  const value = window.getComputedStyle(elem)[attr]
  if (isString(value)) {
    // 匹配字符串的数字字符
    const numberValue = (value as string).match(/\d+/)
    if (numberValue) {
      return pInt(numberValue[0])
    }
  }
}

/**
 * 获取 DOM 元素距离页面的 top、left 值
 * @param elem  DOM 元素
 */
export function offset(elem: HTMLElement): { left: number; top: number } {
  const bounding = elem.getBoundingClientRect()
  return {
    left: window.pageXOffset + bounding.left,
    top: window.pageYOffset + bounding.top,
  }
}

/**
 * 不管是 MutationObserver 还是 DOMNodeRemoved，
 * 当监听某个具体的元素时，如果祖先节点被删除了，并不会触发该元素被移除的事件，
 * 所以要监听整个文档，每次移除事件都得递归遍历要监听的元素是否被删除。
 */
export const observeElementRemoved = (() => {
  const MutationObserver =
    window.MutationObserver || window.WebKitMutationObserver

  const checkElementRemoved = (node: Node, element: HTMLElement) => {
    if (node === element) {
      return true
    }
    if (isElement(node)) {
      const children = (node as HTMLElement).children
      let length = children.length
      while (length--) {
        if (checkElementRemoved(children[length], element)) {
          return true
        }
      }
    }
    return false
  }

  const useMutation = (element: HTMLElement, callback: () => void) => {
    const observer = new MutationObserver((mutations, observer) => {
      let i = mutations.length
      while (i--) {
        const removeNodes = mutations[i].removedNodes
        let j = removeNodes.length
        while (j--) {
          if (checkElementRemoved(removeNodes[j], element)) {
            observer.disconnect()
            return callback()
          }
        }
      }
    })
    observer.observe(document, {
      childList: true,
      subtree: true,
    })
  }

  const useDOMNodeRemoved = (element: HTMLElement, callback: () => void) => {
    const DOMNodeRemoved = (e: Event) => {
      if (checkElementRemoved(e.target as Node, element)) {
        document.removeEventListener('DOMNodeRemoved', DOMNodeRemoved)
        callback()
      }
    }
    document.addEventListener('DOMNodeRemoved', DOMNodeRemoved)
  }

  return MutationObserver ? useMutation : useDOMNodeRemoved
})()
