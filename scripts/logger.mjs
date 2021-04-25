import chalk from 'chalk'

class Logger {
  tips(...args) {
    console.log(chalk.hex('#666')('TIPS'), ...args)
  }

  debug(...args) {
    console.debug(chalk.blue('DEBUG'), ...args)
  }

  log(...args) {
    console.log(chalk.blue('INFO'), ...args)
  }

  info(...args) {
    console.log(chalk.blue('INFO'), ...args)
  }

  warn(...args) {
    console.warn(chalk.yellow('WARN'), ...args)
  }

  error(...args) {
    console.error(chalk.red('ERROR'), ...args)
  }
}

export default new Logger()
