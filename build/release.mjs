import chalk from 'chalk'
import cp from 'child_process'
import compareVersions from 'compare-versions'
import execa from 'execa'
import fs from 'fs'
import inquirer from 'inquirer'
import lodash from 'lodash'
import path from 'path'
import { fileURLToPath } from 'url'

import logger from './logger'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const buildDir = path.resolve(__dirname)
const packageFile = path.resolve(rootDir, 'package.json')
const pkg = JSON.parse(fs.readFileSync(packageFile))

// @flow:
//   1. Check the branch and status of the release.
//   2. Run code lint and automated testing.
//   3. Ask for release version and edit the package.json file.
//   4. Generate changelog?
//   5. Commit version changes. [chore(release): v3.0.0-beta.0]
//   6. Generate git tag.
//   7. Build and publish to NPM.
//   8. Push to remote repository.
//   9. Clean up remnants.

// Discard changes when emit error
process.on('uncaughtException', () => {
  execa.commandSync('git checkout .', { stdio: 'inherit' })
})

checkBranchAndStatus()

// @TODO: Run code lint and automated testing
// await execa.command('yarn lint && yarn test --verbose=false', { stdio: 'inherit' })

const answers = await askReleaseVersion()

// Build files
await execa.command('yarn build', { stdio: 'inherit' })

// Update NPM docs
fs.writeFileSync(
  path.resolve(rootDir, 'README.md'),
  fs.readFileSync(path.resolve(buildDir, 'README_NPM.md'))
)

await execa.command('yarn login', { stdio: 'inherit' })
await execa.command(
  `yarn publish --new-version ${answers.version} --tag ${answers.tag}`,
  { stdio: 'inherit' }
)
await execa.command('git checkout .', { stdio: 'inherit' })

// ******************************
// ******  Function Block  ******
// ******************************
function checkBranchAndStatus() {
  const branchName = execa.commandSync('git symbolic-ref HEAD --short').stdout
  if (branchName !== 'master') {
    logger.error(
      'Publish command running only on the master branch, please checkout it.'
    )
    process.exit(1)
  }

  const status = execa.commandSync('git status --porcelain').stdout
  if (status) {
    logger.error(
      'There are uncommitted files in the workspace, please run the release command in a clean workspace.'
    )
    process.exit(1)
  }
}

// INFO Current version: 3.0.0-beta.0
// New version(optional):
// Set tag(optional):
async function askReleaseVersion() {
  logger.info('Current version:', pkg.version)

  const questions = [
    {
      type: 'input',
      name: 'version',
      message: `New version${chalk.hex('#666')('(optional)')}:`,
    },
    {
      type: 'input',
      name: 'tag',
      message: `Set tag${chalk.hex('#666')('(optional)')}:`,
    },
  ]

  const answers = await inquirer.prompt(questions)

  // Trim the answers of input
  lodash.forEach(answers, (value, key) => {
    answers[key] = value.trim()
  })

  // Check and edit version
  if (answers.version) {
    if (compareVersions.compare(pkg.version, answers.version, '<')) {
      pkg.version = answers.version
      fs.writeFileSync(packageFile, JSON.stringify(pkg, null, 2))
    } else {
      logger.error('New version must be greater than the current version.')
      process.exit(1)
    }
  }

  const version = answers.version ? answers.version : pkg.version

  // fix: execa.command does not recognize whitespace
  cp.execSync(`git commit -am "chore(release): v${version}"`, {
    stdio: 'inherit',
  })

  await execa.command(`git tag v${version}`, { stdio: 'inherit' })

  return {
    version,
    tag: answers.tag || 'latest',
  }
}
