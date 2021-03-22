import nodeResolve from '@rollup/plugin-node-resolve'
import path from 'path'
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'

import pkg from '../package.json'

const versionInfo = `
/*!
 * JParticles v${pkg.version} (https://github.com/Barrior/JParticles)
 * Copyright 2016-${new Date().getFullYear()} Barrior <Barrior@qq.com>
 * Released under the MIT License.
 */
`

const utils = path.resolve(__dirname, '../src/utils/index.ts')
const Base = path.resolve(__dirname, '../src/common/base.ts')
const Mask = path.resolve(__dirname, '../src/common/mask.ts')
const Events = path.resolve(__dirname, '../src/common/events.ts')
const easing = path.resolve(__dirname, '../src/common/easing.ts')
const commonConfig = path.resolve(__dirname, '../src/common/config.ts')

const common = {
  external: [Base, Mask, Events, utils, easing, commonConfig],
  globals: {
    [Base]: 'JParticles.Base',
    [Mask]: 'JParticles.Mask',
    [Events]: 'JParticles.Events',
    [utils]: 'JParticles.utils',
    [easing]: 'JParticles.easing',
    [commonConfig]: 'JParticles.commonConfig',
  },
  plugins: [
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          declaration: false,
          module: 'ESNext',
          rootDir: '.',
        },
      },
    }),
    nodeResolve(),
    terser({
      output: {
        comments: /JParticles v/,
      },
    }),
  ],
}

const effects = [
  { filename: 'line', className: 'Line' },
  { filename: 'particle', className: 'Particle' },
  { filename: 'snow', className: 'Snow' },
  { filename: 'wave', className: 'Wave' },
  { filename: 'wave-loading', className: 'WaveLoading' },
]

const effectInputs = effects.map(({ filename, className }) => {
  return {
    input: path.resolve(__dirname, `../src/${filename}.ts`),
    external: common.external,
    output: {
      file: `browser/${filename}.js`,
      format: 'iife',
      name: `JParticles.${className}`,
      globals: common.globals,
    },
    plugins: [...common.plugins],
  }
})

export default [
  {
    input: path.resolve(__dirname, './browser/jparticles.all.ts'),
    output: {
      file: 'browser/jparticles.all.js',
      format: 'umd',
      esModule: false,
      name: 'JParticles',
      exports: 'named',
      banner: versionInfo.trim(),
    },
    plugins: [...common.plugins],
  },
  {
    input: path.resolve(__dirname, './browser/jparticles.base.ts'),
    output: {
      file: 'browser/jparticles.base.js',
      format: 'umd',
      esModule: false,
      name: 'JParticles',
      exports: 'named',
      banner: versionInfo.trim(),
    },
    plugins: [...common.plugins],
  },
  ...effectInputs,
]
