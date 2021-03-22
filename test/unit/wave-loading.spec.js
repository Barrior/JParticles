import './helpers/dom'
import '../../dist/wave-loading'
import test from 'ava'
const { waveLoading } = JParticles

test('defaultConfig', t => {
  t.deepEqual(waveLoading.defaultConfig, {
    font: 'normal 900 20px Arial',
    smallFont: 'normal 900 14px Arial',
    smallFontOffsetTop: 1,
    color: '#333',
    fillColor: '#27C9E5',
    offsetLeft: 0,
    crestHeight: 4,
    rippleNum: 1,
    speed: 0.3,
    duration: 5000,
    easing: 'swing',
  })
})

test('change defaultConfig', t => {
  const newConfig = {
    color: 'rgba(0, 0, 0, 0)',
    speed: 4,
  }
  waveLoading.defaultConfig = newConfig
  t.deepEqual(waveLoading.defaultConfig, newConfig)
})
