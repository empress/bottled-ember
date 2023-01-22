// TODO: validate inputs?
import { cosmiconfig } from 'cosmiconfig';
import path from 'node:path';
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
    ...result?.config,
    ...args,
    projectRoot: path.join(process.cwd(), args.localFiles),
  };

  return resultFinal2;
}
