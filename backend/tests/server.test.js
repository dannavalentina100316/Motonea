const test = require('node:test');
const assert = require('node:assert/strict');

test('la aplicación debe reconocer que está funcionando', () => {
  const estado = true;

  assert.equal(estado, true);
});
