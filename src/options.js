// TODO: validate inputs?
import assert from 'node:assert';
import { existsSync } from 'node:fs';
import path from 'node:path';

import { cosmiconfig } from 'cosmiconfig';
import { readJsonSync } from 'fs-extra/esm';
/**
 * Local Alias:
 * @typedef {import('./types').Options} Options
 */

/**
 * Merged version of all the Options prioritizing:
 *  - Defaults
 *  - Config overrides
 *  - Args passed to the CLI override everything
 *
 *
 * Possible options:
 *   https://github.com/davidtheclark/cosmiconfig#searchplaces
 *
 * @param {import('./types').Args} args
 * @return {Promise<Options>}
 */
export async function resolveOptions(args) {
  const startIn = path.join(process.cwd(), args.localFiles);
  const explorer = cosmiconfig('buttered-ember');
  const result = await explorer.search(startIn);

  const resultFinal2 = {
    cacheName: path.dirname(startIn),
    ...result?.config,
    ...args,
    projectRoot: path.join(process.cwd(), args.localFiles),
  };

  return resultFinal2;
}

/**
 * @param {Options} options
 * @return {Promise<boolean>}
 */
export async function verifyOptions(options) {
  if (options.template) {
    await verifyTemplate(options, options.template);
  }

  return false;
}

/**
 *
 * @param {Options} options
 * @param {string} template
 */
async function verifyTemplate(options, template) {
  if (!template) return;

  if (template.startsWith('.')) {
    let absolute = path.join(options.projectRoot, template);

    assert(
      existsSync(absolute),
      `Config file specified template, ` +
        template +
        `, but it did not exist. Expected the template to be found at: ` +
        absolute
    );

    return;
  }

  let packageJsonPath = path.join(options.projectRoot, 'package.json');

  let preamble =
    `Config file specified a package that should contain a template: ${template}. ` +
    `When a config file specifies a template, ` +
    `that template must be declared in \`dependencies\` within your project's packgae.json.`;

  assert(
    existsSync(packageJsonPath),
    `${preamble} No package.json was found and was expected to exist at this location: ${packageJsonPath}`
  );

  let packageJson = readJsonSync(packageJsonPath);

  assert(
    packageJson?.dependencies[template],
    `${preamble} package.json did not contain ${template} within the \`dependencies\` list`
  );

  // TODO: assert package can be resolved -- this will ensure depndencies are installed.
  // TODO: assert that the package has a template folder -- this will ensure that the package-specified-as-a-template actually is a template-providing package.
}
