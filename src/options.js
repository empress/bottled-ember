// TODO: validate inputs?
import { cosmiconfig } from 'cosmiconfig';
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
  * @param {Options} args
 * @return {Promise<Options>}
 */
export async function resolveOptions(args) {
  const explorer = cosmiconfig('buttered-ember');
  const result = await explorer.search();

  return {
    ...result?.config,
    ...args,
  };
}

