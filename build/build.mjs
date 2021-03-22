import { Buffer } from 'buffer'
import execa from 'execa'
import fs from 'fs'
import lodash from 'lodash'
import ora from 'ora'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIR_LIB = path.resolve(__dirname, '../lib')
const DIR_BROWSER = path.resolve(__dirname, '../browser')
const DIR_TYPES = path.resolve(__dirname, '../src/types')

const spinner = ora()

// clear build directories
await execa.command(`rm -rf ${DIR_BROWSER} ${DIR_LIB}`, { stdio: 'inherit' })

// generate iife files for browser
await execa.command(
  `npx rollup -c ${path.resolve(__dirname, 'rollup.config.js')}`,
  { stdio: 'inherit' }
)

spinner.start('Generate cjs files for nodejs')
await execa.command(
  `npx ttsc -p ${path.resolve(__dirname, '../tsconfig.build.json')}`,
  { stdio: 'inherit' }
)
spinner.succeed()

// copy types directory
await execa.command(`cp -r ${DIR_TYPES} ${DIR_LIB}`, { stdio: 'inherit' })

insertGlobalTypeRef()

// insert global type declaration into all of `.d.ts` files
function insertGlobalTypeRef() {
  const REF_TYPE = `/// <reference path="types/global.d.ts" />\n`

  const filenames = fs.readdirSync(DIR_LIB)

  lodash.forEach(filenames, (filename) => {
    if (/\.d\.ts$/.test(filename)) {
      const filepath = path.resolve(DIR_LIB, filename)
      fs.writeFileSync(
        filepath,
        Buffer.concat([Buffer.from(REF_TYPE), fs.readFileSync(filepath)])
      )
    }
  })
}
