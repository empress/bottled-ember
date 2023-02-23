import { module, test } from "qunit";
import { setupTest } from "ember-qunit";

import { two } from "@nullvoxpopuli/addon-with-ember-try";

module("sample", function (hooks) {
  setupTest(hooks);

  test("it works", function (assert) {
    assert.strictEqual(two, 2);
  });
});
