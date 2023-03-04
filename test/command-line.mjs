import { execaNode } from 'execa';
import tmp from 'tmp';
import { join } from 'path';
import { expect } from 'chai';
import { readFileSync } from 'fs';

let tmpobj;

describe("command line options", function() {

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

  it('applies --no-overlay correctly', async function() {
    const bottledCacheDir = join(tmpobj.name, 'testing');
    await execaNode('./bin/bottled-ember', ['--no-overlay'], {
      env: {
        BOTTLED_CACHE_DIR: bottledCacheDir,
        BOTTLED_SKIP_DEPENDENCIES: 'true',
        BOTTLED_SKIP_COMMAND: 'true',
      },
      stderr: 'inherit',
      stdout: 'inherit',
    });

    expect(
      readFileSync(join(bottledCacheDir, 'ember-cli-build.js'), 'utf8')
    ).to.equal(readFileSync('./test/fixtures/no-overlay-build.js', 'utf8').replace(/\$FILE_PATH\$/g, process.cwd))
  });

  it('uses an overlay by default', async function() {
    const bottledCacheDir = join(tmpobj.name, 'testing');
    await execaNode('./bin/bottled-ember', [], {
      env: {
        BOTTLED_CACHE_DIR: bottledCacheDir,
        BOTTLED_SKIP_DEPENDENCIES: 'true',
        BOTTLED_SKIP_COMMAND: 'true',
      },
      stderr: 'inherit',
      stdout: 'inherit',
    });

    expect(
      readFileSync(join(bottledCacheDir, 'ember-cli-build.js'), 'utf8')
    ).to.equal(readFileSync('./test/fixtures/overlay-build.js', 'utf8').replace(/\$FILE_PATH\$/g, process.cwd))
  })
})
