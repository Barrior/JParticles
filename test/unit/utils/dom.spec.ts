import {
  getNumberValueOfStyle,
  observeElementRemoved,
  offset,
} from '@src/utils/dom'

test('getNumberValueOfStyle', () => {
  const node = document.createElement('div')
  node.style.width = '300px'
  node.style.height = '300px'
  document.body.appendChild(node)
  expect(getNumberValueOfStyle(node, 'width')).toBe(300)
})

test('observeElementRemoved', () => {
  const node = document.createElement('div')
  document.body.appendChild(node)
  const callback = jest.fn()
  observeElementRemoved(node, callback)
  document.body.removeChild(node)
  setTimeout(() => {
    expect(callback).toHaveBeenCalled()
  })
})

// jsdom does not support `getBoundingClientRect`
test.skip('offset', () => {
  const node = document.createElement('div')
  node.style.width = '100px'
  node.style.height = '100px'
  node.style.position = 'absolute'
  node.style.left = '200px'
  node.style.top = '300px'
  document.body.appendChild(node)

  const pos1 = offset(node)
  expect(pos1.left).toBe(200)
  expect(pos1.top).toBe(300)
})
