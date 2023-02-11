// @ts-check

/**
 * Local Alias:
 * @typedef {import('./types').Options} Options
 */
import { packageJson } from 'ember-apply';
import { execa } from 'execa';
import { findUp } from 'find-up';
import fse from 'fs-extra';
import { pathExistsSync, readJsonSync } from 'fs-extra/esm';
import assert from 'node:assert';
import { createRequire } from 'node:module';
import path from 'node:path';
import yn from 'yn';

const require = createRequire(import.meta.url);
const VERBOSE = yn(process.env.VERBOSE);

/**
 * This is the last step, so it's safe to interact with dependencies,
 * run the package manager, etc
 *
 * @param {Options} options
 * @param {string} cacheDir
 */
export async function applyLayers(options, cacheDir) {
  let isLocalTemplate = options.template?.startsWith('.');

  if (options.template && isLocalTemplate) {
    if (VERBOSE) {
      console.debug(`Layer: Local Template :: ${options.template}`);
    }

    // relative to options' directory?
    let absolute = path.join(options.projectRoot, options.template);

    fse.copySync(absolute, cacheDir, {
      overwrite: true,
      filter: (src) => !src.endsWith('package.json'),
    });
  }

  if (options.localFiles) {
    if (VERBOSE) {
      console.debug(`Local: Local Files :: ${options.template}`);
    }

    let absolute = path.join(process.cwd(), options.localFiles);

    fse.copySync(absolute, cacheDir, {
      overwrite: true,
      filter: (src) => !src.endsWith('package.json'),
    });

    if (options.template && !isLocalTemplate) {
      if (VERBOSE) {
        console.debug(`Layer: Dependency Template :: ${options.template}`);
      }

      try {
        // 1. Resolve path local to the local files
        //    This requires that the dependency is in the local package.json
        //    and that the package.json is included in the project's workspaces
        //    so that linking occurs (which means we can require.resolve)
        let depEntry = require.resolve(options.template, { paths: [absolute] });
        let depPackageJson = await findUp('package.json', { cwd: path.dirname(depEntry) });

        assert(
          depPackageJson,
          `Could not find package.json for the specified template: ${options.template}`
        );

        let depPath = path.dirname(depPackageJson);
        let templatePath = path.join(depPath, 'template');

        assert(
          fse.pathExistsSync(templatePath),
          `Could not find template path within template addon/library. Tried to resolve: ${templatePath}`
        );

        // 2. Add the dep to the package.json in our cacheDir using the file protocol,
        //   pnpm supports this when it detects a path is passed
        //
        //   We don't *really* need to add the dep, but
        //   if we ever want "watch mode", ember-cli will freak out
        //   without the dependency being added.
        //
        //   TODO: how will we re-copy the files back in?
        await execa('pnpm', ['add', depPath], { cwd: cacheDir });

        // 3. Copy the dep's files into the cacheDir
        fse.copySync(templatePath, cacheDir, {
          overwrite: true,
          filter: (src) => !src.endsWith('package.json'),
        });

        // 4. A template of this type *may* have a custom package.json that we need to merge
        //    with the buttered app.
        let partialPackageJsonPath = path.join(templatePath, 'package.json');

        if (fse.existsSync(partialPackageJsonPath)) {
          let toMerge = await packageJson.read(templatePath);

          await packageJson.modify((json) => {
            json.dependencies ||= {};
            json.devDependencies ||= {};

            for (let [dep, version] of Object.entries(toMerge.dependencies || {})) {
              json.dependencies[dep] = version;
            }

            for (let [dep, version] of Object.entries(toMerge.devDependencies || {})) {
              json.devDependencies[dep] = version;
            }
          }, cacheDir);
        }

        await execa('pnpm', ['install', '--fix-lockfile'], { cwd: cacheDir });
      } catch (e) {
        // Mutating the Error message might be dangerous...
        //   🙃
        e.message =
          `Could not find template dependency: ${options.template}. \n` +
          `Make sure that it is declared as a dependencies entry in your buttered-ember ` +
          `project's package.json and that your buttered-ember project is included in your repo's workspaces, ` +
          `if you're using a monorepo.\n` +
          `Tried resolving ${options.template} from ${absolute} via require.resolve\n` +
          `\n` +
          e.message;

        throw e;
      }
    }
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
