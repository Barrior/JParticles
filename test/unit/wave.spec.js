import './helpers/dom'
import '../../dist/wave'
import test from 'ava'
const { wave } = JParticles

test('defaultConfig', t => {
  t.deepEqual(wave.defaultConfig, {
    num: 3,
    fill: false,
    fillColor: [],
    line: true,
    lineColor: [],
    lineWidth: [],
    offsetLeft: [],
    offsetTop: [],
    crestHeight: [],
    rippleNum: [],
    speed: [],
  })
})

test('change defaultConfig', t => {
  const newConfig = {
    num: 2,
    fill: true,
    fillColor: ['red', 'blue', 'green'],
  }
  wave.defaultConfig = newConfig
  t.deepEqual(wave.defaultConfig, newConfig)
})
