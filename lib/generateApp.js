const { mkdirSync, writeFileSync } = require('fs');
const { join } = require('path');
const stripAnsi = require('strip-ansi');

async function generateApp(cacheDir, emberVersion) {
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  const execa = (await import('execa')).execa;

  console.log('generating your bottled-ember app now 🤖');
  mkdirSync(cacheDir, { recursive: true });

  await execa('npm', ['-v']);

  // this prevents ember-cli from thinking it's already in an ember addon/app
  // when running from the cache directory. Adding a package.json just short-circuits
  // the mechanism that ember-cli uses to identify that it's already in an app/addon
  writeFileSync(join(cacheDir, 'package.json'), '{}');

  const initCommand = execa(
    'npx',
    [`ember-cli@${emberVersion}`, 'init', '--skip-npm', '--no-welcome'],
    {
      cwd: cacheDir,
    },
  );

  initCommand.stdout.setEncoding('utf8');

  initCommand.stdout.on('data', (data) => {
    if (stripAnsi(data).includes('Overwrite package.json?')) {
      initCommand.stdin.write('y\n');
    }
  });

  await initCommand;

  console.log(`bottled-ember app finished initialising 🤖`);
}

module.exports = generateApp;
