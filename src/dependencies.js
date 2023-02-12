import { packageJson } from "ember-apply";
import fse from 'fs-extra'
import path from 'node:path';

/**
 * Less stuff to install, the faster install happens.
 * the linting and formatting stuff, in particular, has a lot of on-disk space.
 */
const DEFAULT_DEPS_TO_REMOVE = [
  'ember-cli-sri',
  'ember-template-lint',
  'eslint',
  'eslint-config-prettier',
  'eslint-plugin-ember',
  'eslint-plugin-n',
  'eslint-plugin-prettier',
  'eslint-plugin-qunit',
  'prettier',
  'concurrently',
  '@typescript-eslint/eslint-plugin',
  '@typescript-eslint/parser',
  '@babel/eslint-parser',
  'ember-welcome-page',
  'babel-eslint',
  'ember-fetch',
  'ember-data',
];


/**
 * @param {Options} options
 * @param {string} cacheDir
 */
export async function removeDefaults(options, cacheDir) {
  await packageJson.modify((pJson) => {
    let toRemove = [...DEFAULT_DEPS_TO_REMOVE, ...(options.removeDependencies || [])];

    if (pJson.devDependencies) {
      for (let dep of toRemove) {
        delete pJson.devDependencies[dep];
      }
    }

    if (pJson.dependencies) {
      for (let dep of toRemove) {
        delete pJson.devDependencies[dep];
      }
    }
  }, cacheDir);
}

/**
 * @param {Options} options
 * @param {string} cacheDir
 */
export async function modifyDependenciesFromOptions(options, cacheDir) {
  await packageJson.modify((pJson) => {
    let newDeps = options.dependencies || {};
    let toRemove = options.removeDependencies || [];

    if (pJson.devDependencies) {
      for (let dep of toRemove) {
        delete pJson.devDependencies[dep];
      }

      for (let dep of Object.keys(newDeps)) {
        delete pJson.devDependencies[dep];
      }
    }

    if (pJson.dependencies) {
      for (let dep of toRemove) {
        delete pJson.devDependencies[dep];
      }
    }

    pJson.dependencies = {
      ...(pJson.dependencies || {}),
      ...newDeps,
    };
  }, cacheDir);
}


/**
 * @param {string} cacheDir
 * @param {string} templatePath
 */
export async function mergePackageJson(cacheDir, templatePath) {
  let partialPackageJsonPath = path.join(templatePath, 'package.json');

  if (fse.existsSync(partialPackageJsonPath)) {
    let toMerge = await packageJson.read(templatePath);

  /**
    * We can't guarantee that version is going to be an actual SemVer version.
    * It could be a file:// or github:// protocol, which I think all package managers support.
    * Where we get in to trickyness is when packages exist in a monorepo, and don't have a way to
    * declare that they're in the monorepo.
    *
    * Thankfully, pnpm provides the "workspace protocol", for us to key off of.
    * So, supporting in-monorepo linked dependencies here can only happen for pnpm
    * monorepos.
    *
    * This is useful because in a buttered project,
    * the user may want to link to an in-monorepo package that
    * they want to test -- such as in qunit-assertions-extra
    */
    async function resolveVersion(dep, version) {
      if (!version.startsWith('workspace:')) return version;

      let depEntryPoint = require.resolve(dep, { paths: [templatePath] });
      let depPackageJson = await findUp('package.json', { cwd: path.dirname(depEntryPoint)});

      assert(depPackageJson, `Could not find package.json for ${dep}, specified at: ${templatePath}`);

      let depPath = path.dirname(depPackageJson);

      return `workspace:${depPath}`;
    }

    await packageJson.modify(async (json) => {
      json.dependencies ||= {};
      json.devDependencies ||= {};

      for (let [dep, version] of Object.entries(toMerge.dependencies || {})) {
        json.dependencies[dep] = await resolveVersion(version);
      }

      for (let [dep, version] of Object.entries(toMerge.devDependencies || {})) {
        json.devDependencies[dep] = await resolveVersion(version);
      }
    }, cacheDir);
  }
}

