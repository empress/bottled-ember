// @ts-check

/**
 * Local Alias:
 * @typedef {import('./types').Options} Options
 */
import fse from 'fs-extra';
import { pathExistsSync, readJsonSync } from 'fs-extra/esm';
import path from 'node:path';

/**
 * @param {Options} options
 * @param {string} cacheDir
 */
export async function applyLayers(options, cacheDir) {
  if (options.template?.startsWith('.')) {
    // relative to options' directory?
    let absolute = path.join(options.projectRoot, options.template);

    fse.copySync(absolute, cacheDir, {
      overwrite: true,
      filter: (src) => !src.endsWith('package.json'),
    });
  }

  if (options.localFiles) {
    let absolute = path.join(process.cwd(), options.localFiles);

    fse.copySync(absolute, cacheDir, { overwrite: true });
  }
}

/**
 * @param {Options} options
 */
export async function packageInfoForTemplate(options) {
  if (options.template?.startsWith('.')) {
    // relative to options' directory?
    let absolute = path.join(options.projectRoot, options.template);
    let pJson = path.join(absolute, 'package.json');

    if (pathExistsSync(pJson)) {
      return readJsonSync(pJson);
    }
  }

  // TODO:
  //   - download dep of the template
  //   - extract the package.json from within the template folder
  //     within the downloaded dep
  // if (options.template) {
  // }

  return {};
}

/**
 * @param {Options} options
 */
export async function dependenciesForTemplate(options) {
  let pJson = await packageInfoForTemplate(options);
  let deps = pJson.dependencies || {};

  return deps;
}
