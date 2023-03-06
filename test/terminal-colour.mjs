import { execaNode } from 'execa';
import tmp from 'tmp';
import { join } from 'path';

let tmpobj;

describe.only("Terminal colour", function() {

  // 2 mins timeout
  this.timeout(5 * 60 * 1000);


  beforeEach(function() {
    tmpobj = tmp.dirSync({
      unsafeCleanup: true,
    });
  })

  afterEach(function() {
    tmpobj.removeCallback();
  })

  it('doesnt halt when the terminal has colour forced', async function() {
    const bottledCacheDir = join(tmpobj.name, 'testing');
    await execaNode('./bin/bottled-ember', ['--no-overlay'], {
      env: {
        BOTTLED_CACHE_DIR: bottledCacheDir,
        BOTTLED_SKIP_DEPENDENCIES: 'true',
        BOTTLED_SKIP_COMMAND: 'true',
        FORCE_COLOR: 3,
      },
      stderr: 'inherit',
      stdout: 'inherit',
    });
  });

  it('doesnt halt when the terminal has colour turned off', async function() {
    const bottledCacheDir = join(tmpobj.name, 'testing');
    await execaNode('./bin/bottled-ember', ['--no-overlay'], {
      env: {
        BOTTLED_CACHE_DIR: bottledCacheDir,
        BOTTLED_SKIP_DEPENDENCIES: 'true',
        BOTTLED_SKIP_COMMAND: 'true',
        FORCE_COLOR: 0,
      },
      stderr: 'inherit',
      stdout: 'inherit',
    });
  });
});
