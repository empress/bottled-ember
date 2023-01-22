// @ts-check

/**
 * Local Alias:
 * @typedef {import('./types').Options} Options
 */
import fse from 'fs-extra';
import path from 'node:path';

/**
 * @param {Options} options
 * @param {string} cacheDir
 */
export async function applyLayers(options, cacheDir) {
  if (options.templateOverlay.startsWith('.')) {
    // relative to options' directory?
    let absolute = path.join(process.cwd(), options.templateOverlay);

    fse.copySync(absolute, cacheDir, { overwrite: true });
  }

  if (options.localFiles) {
    let absolute = path.join(process.cwd(), options.localFiles);

    fse.copySync(absolute, cacheDir, { overwrite: true });
  }
}
