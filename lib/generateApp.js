const { mkdir, rename } = require('fs/promises');
const tmp = require('tmp');

async function generateApp(cacheDir, emberVersion) {
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  const execa = (await import('execa')).execa;

  console.log('generating your bottled-ember app now 🤖');
  await mkdir(cacheDir, { recursive: true });

  // we generate into a tmpdir so that ember-cli doesn't pick up a locally
  // installed ember-cli and use the wrong version to generate our ember app
  const tmpobj = tmp.dirSync({ keep: true });

  const initCommand = execa(
    'npx',
    [`ember-cli@${emberVersion}`, 'init', '--skip-npm', '--no-welcome'],
    {
      cwd: tmpobj.name,
    },
  );

  await initCommand;
  await rename(tmpobj.name, cacheDir);

  console.log(`bottled-ember app finished initialising 🤖`);
}

module.exports = generateApp;
