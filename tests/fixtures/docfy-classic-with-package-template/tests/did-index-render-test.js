import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit } from '@ember/test-helpers';

module('Markdown rendering', function(hooks) {
  setupApplicationTest(hooks);

  test('it works', async function (assert) {
    await visit('/docs/');

    assert.dom('h1').containsText('A Heading');
    assert.dom().containsText('We did it!');
  });
});
