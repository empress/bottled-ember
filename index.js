const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

let writeFile = require('broccoli-file-creator');

module.exports.build = function (defaults) {
  let app = new EmberAddon(defaults, {
    trees: {
      app: `node_modules/bottled-ember/app`,
      styles: writeFile('/styles/app.css', ''),
      tests: null,
      public: 'public',
    },
  });

  return app.toTree();
};
