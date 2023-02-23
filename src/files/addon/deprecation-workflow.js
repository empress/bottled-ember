/* globals self */
self.deprecationWorkflow = self.deprecationWorkflow || {};

self.deprecationWorkflow.config = {
  /**
   * It's important for addon authors to deal with deprecations as soon as they are detectable
   * so that downstream consumers have an easier time upgrading
   */
  throwOnUnhandled: true,

  workflow: [
    /**
     * Deprecation handler entries go here.
     * See: https://github.com/mixonic/ember-cli-deprecation-workflow#handlers
     */
  ],
};
