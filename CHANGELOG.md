# buttered-ember

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
