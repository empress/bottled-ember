import { execaNode } from 'execa';
import tmp from 'tmp';
import { join, dirname } from 'path';
import { expect } from 'chai';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

let tmpobj;

describe("custom config file", function() {

  // 5 mins timeout
  this.timeout(5 * 60 * 1000);


  beforeEach(function() {
    tmpobj = tmp.dirSync({
      unsafeCleanup: true,
    });
  })

  afterEach(function() {
    tmpobj.removeCallback();
  })

  it.only('can read fastbootDependencies', async function() {
    const cwd = join(tmpobj.name, 'testing');

    mkdirSync(cwd, {recursive: true});

    writeFileSync(join(cwd, 'package.json'), '{"name": "face"}');
    writeFileSync(join(cwd, 'config.js'), `module.exports.fastbootDependencies = ['face'];`);

    await execaNode(join(__dirname, '..', 'bin', 'bottled-ember'), ['--no-overlay', '--ember-version', '4.12'], {
      cwd,
      env: {
        BOTTLED_SKIP_DEPENDENCIES: 'true',
        BOTTLED_SKIP_COMMAND: 'true',
      },
      stderr: 'inherit',
      stdout: 'inherit',
    });

    const generatedJson = JSON.parse(readFileSync(join(cwd, 'node_modules', '.cache', 'bottled-ember-4-12-default', 'package.json'), 'utf8'));

    expect(generatedJson.fastbootDependencies).to.deep.equal(['face']);
  });
})
