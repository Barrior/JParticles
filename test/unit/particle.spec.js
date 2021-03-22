import './helpers/dom'
import '../../dist/particle'
import test from 'ava'
const { particle } = JParticles

test('defaultConfig', t => {
  t.deepEqual(particle.defaultConfig, {
    num: 0.12,
    maxR: 2.4,
    minR: 0.6,
    maxSpeed: 1,
    minSpeed: 0.1,
    proximity: 0.2,
    range: 0.2,
    lineWidth: 0.2,
    lineShape: 'spider',
    eventElem: null,
    parallax: false,
    parallaxLayer: [1, 2, 3],
    parallaxStrength: 3,
  })
})

test('change defaultConfig', t => {
  const newConfig = {
    num: 2,
    maxR: 2,
    minR: 1,
  }
  particle.defaultConfig = newConfig
  t.deepEqual(particle.defaultConfig, newConfig)
})
