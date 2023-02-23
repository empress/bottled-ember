# buttered-ember

## 0.4.0

### Minor Changes

- [#11](https://github.com/NullVoxPopuli/buttered-ember/pull/11) [`d40892c`](https://github.com/NullVoxPopuli/buttered-ember/commit/d40892c1c1a7fa80e4cc27711eeb541176c60d6d) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Support "addon mode", which enables ember-try and ember-cli-deprecation-workflow.

  This will be most useful for testing v2 addons without any of the test-app boilerplate.
  Atm, it's primitive -- in that it best supports JS v2 addons, but TypeScript is planned
  as a quick followup.

  To enable addon mode, use the `--addon` flag when invoking the CLI.

  ```bash
  npx buttered-ember --addon ...
  ```

  This will include in the generated app:

  - ember-try config
    to configure C.I. to run these try scenarios
    ```bash
    npx buttered-ember try:one $SCENARIO --addon
    # or
    npx buttered-ember try:each --addon
    # example:
    npx buttered-ember try:one "'ember-release + embroider-optimized'"
    ```
    At the moment this default ember-try config includes the following scenarios:
    - `ember-3.28` : `ember-source@~3.28.0`
    - `ember-4.0` : `ember-source@~4.0.0`
    - `ember-4.4` : `ember-source@~4.4.0`
    - `ember-4.8` : `ember-source@~4.8.0`
    - `ember-release` : `ember-source@release`
    - `ember-beta` : `ember-source@beta`
    - `ember-canary` : `ember-source@canary`
    - `"'ember-release + embroider-safe'"` : `ember-source@release` + `emboroider-safe`
    - `"'ember-release + embroider-optimized'"` : `ember-source@release` + `emboroider-optimized`
    - `"'ember-lts-4.8 + embroider-optimized'"` : `ember-source@~4.8.0` + `emboroider-optimized`
  - ember-cli-deprecation-workflow
    this has `throwOnUnhandled` set to `true`, so that addon authors can immediately be made aware
    of an issue so that consumers of the addon have smoother upgrade paths.

  Both files can be overridden by adding a config/ember-try.js or config/deprecation-workflow.js file to your addon's test project.

  Note that the generated app's module name is `test-app`

### Patch Changes

- [`bc62028`](https://github.com/NullVoxPopuli/buttered-ember/commit/bc6202889fede78c23db78557b0c707023cb3b50) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Sanitize the default path name for the default cache location

## 0.3.0

### Minor Changes

- [#8](https://github.com/NullVoxPopuli/buttered-ember/pull/8) [`5bc6400`](https://github.com/NullVoxPopuli/buttered-ember/commit/5bc6400cdece6f193dde20d18646b3fbbc263e2b) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Any time the package.json for the buttered app is modified,
  we have a chance to unwravel the workspace protocol, if pnpm is used.
  This is useful when a buttered app is used as a boilerplate-free test-app
  and the package needing tests is in the same monorepo.

  This is not possible to support with yarn or npm monorepos,
  as they don't have any sort of workspace protocol -- a way to differentiate between
  real published packages and packages in a monorepo

## 0.2.0

### Minor Changes

- [#6](https://github.com/NullVoxPopuli/buttered-ember/pull/6) [`9b3856c`](https://github.com/NullVoxPopuli/buttered-ember/commit/9b3856c354f6d30406473253a79f5c86e545066f) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Using templates with local directories as well as in-monorepo dependencies now in tested and works.

  Support for using a template from a dependency is new though!

  To use a template from a dependency, which may be addon,
  add a `template` directory. This allows a template to exist within an existing addon without changing anything that would affect ember consumption of that addon.

  Then, in the root of your buttered ember project, specify in your
  `.buttered-emberrc.yaml` file (or any other compatible config name),
  the name of the dependency to look for a `template` folder within.

  ```yml
  template: '@nullvoxpopuli/docfy-template-provider'
  ```

  Your `template` folder may contain a `package.json`, which then may add `dependencies` and `devDependencies` to the resulting buttered project.

## 0.1.2

### Patch Changes

- [#4](https://github.com/NullVoxPopuli/buttered-ember/pull/4) [`49a8ecb`](https://github.com/NullVoxPopuli/buttered-ember/commit/49a8ecbec326eae28e2652bef8cab8a511cdfa66) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Local templates are now supported. See readme for details on templates.

## 0.1.1

### Patch Changes

- [#3](https://github.com/NullVoxPopuli/buttered-ember/pull/3) [`45f87de`](https://github.com/NullVoxPopuli/buttered-ember/commit/45f87de11904602246b68a489a30240f7f8c545a) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Allow any files to overwrite any file of the host app, including ember-cli-build.js. This allows the overlaying files to do whatever they want, include switch to embroider, or _strictest mode_ embroider"

- [#1](https://github.com/NullVoxPopuli/buttered-ember/pull/1) [`d25ad0f`](https://github.com/NullVoxPopuli/buttered-ember/commit/d25ad0fd894e842dcba566556c8b6127b51e5bc2) Thanks [@NullVoxPopuli](https://github.com/NullVoxPopuli)! - Rename package.
