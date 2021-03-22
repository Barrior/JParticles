import './helpers/dom'
import test from 'ava'
import pkg from '../../package.json'
const { version, utils, commonConfig, Base } = JParticles

test('Delete JParticles props is not allowed', t => {
  for (const prop in JParticles) {
    if (prop !== 'commonConfig') {
      t.throws(() => {
        delete JParticles[prop]
      })
    }
  }
})

test('version', t => {
  t.is(version, pkg.version)
})

test('commonConfig', t => {
  t.deepEqual(commonConfig, {
    opacity: 1,
    color: [],
    resize: true,
  })
})

test('Base class', t => {
  Base.prototype.init = () => {}
  const constructor = {}
  const container = document.createElement('div')
  const base = new Base(constructor, container)
  t.truthy(base.set)

  // skip the following assertion because of JSDOM does not support Canvas drawing environment now.
  t.skip.truthy(base.cxt)

  t.false(base.paused)
  t.true(utils.isElement(base.c))
  t.true(utils.isElement(base.container))
  t.true(utils.isArray(base.destructionListeners))
  t.true(utils.isFunction(base.color))
  t.true(utils.isFunction(base.requestAnimationFrame))
  t.true(utils.isFunction(base.observeCanvasRemoved))
  t.true(utils.isFunction(base.onDestroy))
  t.true(utils.isFunction(base.pause))
  t.true(utils.isFunction(base.open))
  t.true(utils.isFunction(base.resize))
  t.true(utils.isFunction(base._resizeHandler))
  t.is(base.ch, 300)
  t.is(base.cw, 485)
})

test('utils.regExp', t => {
  t.deepEqual(utils.regExp, {
    trimAll: /\s/g,
    styleValue: /^\d+(\.\d+)?[a-z]+$/i,
  })
})

test('utils.orientationSupport', t => {
  t.false(utils.orientationSupport)
})

test('utils.pInt', t => {
  t.is(utils.pInt('200px'), 200)
  t.is(utils.pInt('0x200'), 0)
})

test('utils.trimAll', t => {
  t.is(utils.trimAll(' so me st ring '), 'somestring')
})

test('utils.randomColor', t => {
  const colorRule = /^#[0123456789ABCDEF]{6}$/i
  for (let i = 0; i < 3; i++) {
    t.regex(utils.randomColor(), colorRule)
  }
})

test('utils.limitRandom', t => {
  // 正确格式：(max, min)
  ;[[8, 3], [10, -2], [-5, -8]].forEach(item => {
    for (let i = 0; i < 3; i++) {
      const value = utils.limitRandom(item[0], item[1])
      value >= item[1] && value < item[0] ? t.pass() : t.fail()
    }
  })

  // 反序格式：(min, max)
  ;[[1, 10], [-6, 7], [-8, -5]].forEach(item => {
    for (let i = 0; i < 3; i++) {
      const value = utils.limitRandom(item[0], item[1])
      value >= item[0] && value < item[1] ? t.pass() : t.fail()
    }
  })

  // 等值格式
  t.is(utils.limitRandom(10, 10), 10)
  t.is(utils.limitRandom(0.1, 0.1), 0.1)
})

test('utils.extend', t => {
  const a1 = {
    a: 0,
    b: {
      c: 1,
      d: 2,
    },
    e: [1, 2, 3],
  }
  const b1 = {
    a: 3,
    b: {
      c: 4,
    },
  }
  const obj1 = utils.extend(a1, b1)
  t.true(obj1 === a1)
  t.deepEqual(obj1, {
    a: 3,
    b: {
      c: 4,
    },
    e: [1, 2, 3],
  })

  // deep copy
  const a2 = {
    a: 0,
    b: {
      c: 1,
      d: 2,
    },
    e: [1, 2, 3],
  }
  const b2 = {
    a: 3,
    b: {
      c: 4,
    },
    e: [4, 5],
  }
  const obj2 = utils.extend(true, a2, b2)
  t.true(obj2 === a2)
  t.deepEqual(obj2, {
    a: 3,
    b: {
      c: 4,
      d: 2,
    },
    e: [4, 5, 3],

    // 当前是通过 key 扩展，如上。
    // 未实现通过值扩展，如下。
    // 这是一种选择，当前选择与 jQuery 保持一致。
    // e: [1, 2, 3, 4, 5]
  })
})
;+(function() {
  const types = [
    { type: '[object Function]', value() {} },
    { type: '[object Object]', value: {} },
    { type: '[object Array]', value: [] },
    { type: '[object String]', value: 'string' },
    { type: '[object Boolean]', value: true },
    { type: '[object Boolean]', value: false },
    { type: '[object Number]', value: 0 },
    { type: '[object Number]', value: 1 },
    { type: '[object Null]', value: null },
    { type: '[object Undefined]', value: undefined },
    { type: '[object Symbol]', value: Symbol() },
  ]

  test('utils.typeChecking', t => {
    types.forEach(item => {
      t.true(utils.typeChecking(item.value, item.type))
    })
  })
  test('utils.isFunction', t => {
    types.forEach((item, i) => {
      t[i == 0 ? 'true' : 'false'](utils.isFunction(item.value))
    })
  })
  test('utils.isPlainObject', t => {
    types.forEach((item, i) => {
      t[i == 1 ? 'true' : 'false'](utils.isPlainObject(item.value))
    })
  })
  test('utils.isArray', t => {
    types.forEach((item, i) => {
      t[i == 2 ? 'true' : 'false'](utils.isArray(item.value))
    })
  })
  test('utils.isString', t => {
    types.forEach((item, i) => {
      t[i == 3 ? 'true' : 'false'](utils.isString(item.value))
    })
  })
  test('utils.isBoolean', t => {
    types.forEach((item, i) => {
      t[i == 4 || i == 5 ? 'true' : 'false'](utils.isBoolean(item.value))
    })
  })

  // 还未加 utils.isNumber
  test.skip('utils.isNumber', t => {
    types.forEach((item, i) => {
      t[i == 6 || i == 7 ? 'true' : 'false'](utils.isNumber(item.value))
    })
  })

  test('utils.isNull', t => {
    types.forEach((item, i) => {
      t[i == 8 ? 'true' : 'false'](utils.isNull(item.value))
    })
  })
  test('utils.isUndefined', t => {
    types.forEach((item, i) => {
      t[i == 9 ? 'true' : 'false'](utils.isUndefined(item.value))
    })
  })

  // test isElement
  test('utils.isElement', t => {
    types.forEach(item => {
      t.false(utils.isElement(item.value))
    })
    t.false(utils.isElement(document))
    t.false(utils.isElement(document.createTextNode('text')))
    t.true(utils.isElement(document.body))
    t.true(utils.isElement(document.querySelector('head')))
    t.true(utils.isElement(document.querySelector('html')))
    t.true(utils.isElement(document.createElement('i')))
  })
})()

test.skip('utils.observeElementRemoved', t => {
  const element = document.createElement('i')
  document.body.appendChild(element)

  utils.observeElementRemoved(element, () => {
    t.pass('Element has been removed')
    t.end()
  })

  setTimeout(() => {
    document.body.removeChild(element)
    setTimeout(() => {
      t.fail()
      t.end()
    }, 50)
  }, 50)
})

test('utils.getCss', t => {
  const element = document.createElement('div')
  const background = 'red'
  const border = '1px solid #ccc'
  element.style.width = '200px'
  element.style.background = background
  element.style.border = border
  document.body.appendChild(element)

  t.is(utils.getCss(element, 'width'), 200)
  t.is(utils.getCss(element, 'background'), background)
  t.is(utils.getCss(element, 'border'), border)
})

test.skip('utils.offset', t => {
  const element = document.createElement('div')
  const offset = {
    left: '100px',
    top: '200px',
  }
  element.style.position = 'absolute'
  element.style.left = offset.left
  element.style.top = offset.top
  document.body.appendChild(element)

  t.is(utils.offset(element), offset)
})

test('utils.on', t => {
  const element = document.createElement('div')
  utils.on(element, 'click', () => {
    t.pass('Event triggered!')
  })
  document.body.appendChild(element)
  element.click()
})

test.cb('utils.off', t => {
  const element = document.createElement('div')
  const handlerClick = () => {
    t.fail('Event triggered!')
    t.end()
  }
  utils.on(element, 'click', handlerClick)
  utils.off(element, 'click', handlerClick)
  document.body.appendChild(element)
  element.click()
  setTimeout(() => {
    t.pass()
    t.end()
  }, 100)
})

test('utils.scaleValue', t => {
  t.is(utils.scaleValue(0), 0)
  t.is(utils.scaleValue(1), 1)
  t.is(utils.scaleValue(0.5, 10), 5)
  t.is(utils.scaleValue(0.124, 10), 1.24)
})

test('utils.calcSpeed', t => {
  // 正确格式：(max > 0, min > 0)
  ;[[2, 0], [88, 22], [5, 1], [52.31, 1.24]].forEach(item => {
    for (let i = 0; i < 3; i++) {
      const speed = utils.calcSpeed(item[0], item[1])
      if (speed === 0) {
        t.fail()
      } else {
        speed > -Math.abs(item[0]) && speed < item[0] ? t.pass() : t.fail()
      }
    }
  })

  t.is(Math.abs(utils.calcSpeed(0, 0)), 0)
})

test.todo('utils.pause')
test.todo('utils.open')
test.todo('utils.resize')
test.todo('utils.modifyPrototype')

test('utils.defineReadOnlyProperty', t => {
  let man = {
    name: 'Barrior',
    age: 24,
  }

  // value, prop, object
  for (const prop in man) {
    utils.defineReadOnlyProperty(man[prop], prop, man)
  }

  t.throws(() => {
    man.name = 'Tom'
  })

  t.throws(() => {
    delete man.age
  })

  t.is(man.name, 'Barrior')
  t.is(man.age, 24)
})

test('utils.registerListener', t => {
  const emulate = {
    set: true,
  }
  const listeners = []
  utils.registerListener(emulate, listeners, () => 0, () => 1, () => 2, () => 3)
  utils.registerListener(emulate, listeners, () => 4)
  listeners.forEach((item, index) => {
    t.is(item(), index)
  })
})
