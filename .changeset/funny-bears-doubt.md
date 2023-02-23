---
'buttered-ember': minor
---

Support "addon mode", which enables ember-try and ember-cli-deprecation-workflow.

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
