import chalk from 'chalk';

/**
 * @param {string | Error} msg
 */
export function error(msg) {
  if (typeof msg !== 'string') {
    if (msg instanceof Error) {
      msg = msg.message + `\n\n` + msg.stack;
    }
  }

  console.error(chalk.red((msg)));
}

/**
 * @param {string} msg
 */
export function info(msg) {
  console.info(stripIndent(msg));
}
