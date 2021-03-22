const jsdom = require('jsdom')
const dom = new jsdom.JSDOM('<!DOCTYPE html>')
global.window = dom.window
global.document = dom.window.document
global.navigator = dom.window.navigator

const JParticles = require('../../../dist/jparticles')
global.JParticles = JParticles
