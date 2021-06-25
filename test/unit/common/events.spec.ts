import Events from '@src/common/events'

test('移除特定事件', () => {
  const events = new Events()
  const handler = jest.fn()

  // 绑定事件，多个
  events.on('eventName', handler)
  events.on('eventName', handler)

  // 触发事件
  events.trigger('eventName')
  expect(handler).toHaveBeenCalledTimes(2)

  // 移除事件
  events.off('eventName')
  events.trigger('eventName')
  expect(handler).toHaveBeenCalledTimes(2)
})

test('移除特定事件处理函数', () => {
  const events = new Events()
  const handler1 = jest.fn()
  const handler2 = jest.fn()

  // 绑定事件，不同处理函数
  events.on('eventName', handler1)
  events.on('eventName', handler2)

  // 触发事件
  events.trigger('eventName')

  // 校验
  expect(handler1).toHaveBeenCalledTimes(1)
  expect(handler2).toHaveBeenCalledTimes(1)

  // 移除事件的 handler1
  events.off('eventName', handler1)
  events.trigger('eventName')

  // 校验
  expect(handler1).toHaveBeenCalledTimes(1)
  expect(handler2).toHaveBeenCalledTimes(2)
})

test('移除所有事件', () => {
  const events = new Events()
  const handler1 = jest.fn()
  const handler2 = jest.fn()

  // 绑定事件，不同处理函数
  events.on('eventName1', handler1)
  events.on('eventName2', handler2)

  // 触发事件
  events.trigger('eventName1')
  events.trigger('eventName2')

  // 校验
  expect(handler1).toHaveBeenCalledTimes(1)
  expect(handler2).toHaveBeenCalledTimes(1)

  // 移除所有事件
  events.off()
  events.trigger('eventName1')
  events.trigger('eventName2')

  // 校验
  expect(handler1).toHaveBeenCalledTimes(1)
  expect(handler2).toHaveBeenCalledTimes(1)
})

test('确保参数传递正确', () => {
  const events = new Events()
  const handler = jest.fn()

  events.on('eventName', handler)

  // 校验
  events.trigger('eventName')
  expect(handler).toHaveBeenCalledWith()

  // 校验
  events.trigger('eventName', 'arg1')
  expect(handler).toHaveBeenCalledWith('arg1')

  // 校验
  events.trigger('eventName', 'arg1', 2)
  expect(handler).toHaveBeenCalledWith('arg1', 2)
})
