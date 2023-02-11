# buttered-ember

This is a fork of [bottled-ember][upstream], a CLI tool for bootstrapping ember projects without all the boilerplate.

[upstream]: https://github.com/empress/bottled-ember

## Usage

```bash
npx buttered-ember ./your-files
```

This will merge `./your-files` into the backing app, allowing you to focus on _just your own work_, without being bogged down by the boilerplate of linting, package management, etc.

This can pair well with documentation generation.
For example:

```bash
npx buttered-ember ./docs
```

Where `./docs` could be a collection of markdown files.
Ember doesn't natively support markdown-to-html conversion,
but other dependencies can handle this.

To keep the management of "dependencies" minimal,
a configuration file may be defined,

```yaml
# yaml
# -> all properties are optional
#
# could be any npm dependency
# - this provides markdown to html conversion
# - default routing, templates, etc
template: '@my-scope/my-template'
dependencies:
  'highlight.js': '^11.0.0'
```

### Templates

Templates are special folders that are applied like the "local files" that an end-user would be working with.
An example use case could be a markdown-only project,
but you want a common design / theme for all documentation sites published.

Unlike a v1 addon with _aggressive_ app-re-exports, templates may provide top-level files, outside the app folder.

The "template root" is layered on top of the project root, so you can augment more than just the app folder.

For example:

```
.
├── package.json
└── template/
    ├── app/
    │   ├── router.js
    │   └── templates/
    │       └── application.hbs
    ├── docs/
    │   └── welcome.md
    ├── ember-cli-build.js
    └── .docfy.config.js
```

<!--
https://tree.nathanfriend.io/?s=(%27options!(%27fancy5~fullPath!false~trailingSlash5~rootDot5)~9(%279%27package8on7642app40router8*06s430application.hbs*2docs40welcome.md*2ember-cli-build8*2.docfy.config87%27)~version!%271%27)*730322-%203%20%204%2F*5!true6template7%5Cn8.js9source!%01987654320*
-->

The advantage of this `template` folder is that is that it may be authored along side an addon or app so that the template itself can be automatedly tested.

Note that nothing _outside_ the template folder is considered part of the template.
So in the event you need to add dependencies as a part of your template,
you'll want _another_ `package.json` within the `template` folder.

### Config

This uses [cosmiconfig][gh-cosmiconfig], so the following config formats are suppored:

- "buttered-ember" entry in package.json
- `.buttered-emberrc.json`
- `.buttered-emberrc.yaml`
- `.buttered-emberrc.yml`
- `.buttered-emberrc.js`
- `.buttered-emberrc.cjs`
- or any of the above in a `./config/` directory
- `buttered-ember.config.js`
- `buttered-ember.config.cjs`

[gh-cosmiconfig]: https://github.com/davidtheclark/cosmiconfig

### Live-reload (wip)

_NOTE: this is not yet tested, and likely broken_
_the goal here is that, even with markdown only projects, we should have live reload_.

By default, the whole target directory will be watched for changes.
If You need to work with the `app` or `tests` directories, those will
also be wired up for you, but in the event you need a custom `ember-cli-build.js`,
you can import a utility function and use the same watching logic:

```js
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { watchTrees } = require('buttered-ember');

module.exports = function (defaults) {
  const app = new EmberApp(defaults);

  const { Webpack } = require('@embroider/webpack');
  return require('@embroider/compat').compatBuild(app, Webpack, {
    extraPublicTrees: [watchTrees()],
    staticAddonTestSupportTrees: true,
    staticAddonTrees: true,
    staticHelpers: true,
    staticModifiers: true,
    staticComponents: true,
  });
};
```

## Contributing

### Testing

The test suite is split in to two test projects, a "regular" one, and one with "slow" tests.

These can each be ran via:

```bash
pnpm test # regular tests
pnpm test:slow # slow tests
```

The slow tests are more "end-to-end" focused, and run on full apps.
When prefixing the test command with `VERBOSE=true`,
the command to run in what directory run in will be printed before the test runs.

Example

```
VERBOSE=true pnpm test:slow


Running on fixture:

	node <repo>/src/bin.js test

In <repo>/tests/fixtures/docfy-classic-build
```

So for this test, we'd `cd` to `/tests/fixtures/docfy-classic-build` and run `node ../../../src/bin.js test` (or use the absolute path to the bin like the output says)
