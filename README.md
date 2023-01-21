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
deps:
  'highlight.js': '^11.0.0'
```

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
