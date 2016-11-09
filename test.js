var assert = require('assert')
test(false, false)
test(false, true)
test(true, false)
test(true, true)

function test (mandatoryAsArray, scopeAsArray) {
  function scopes (mandatory) {
    var mod = require('./index')
    var check
    if (scopeAsArray) check = mod(mandatory.split(' '))
    else check = mod(mandatory)

    return function (val) {
      if (scopeAsArray) return check(val.split(' '))
      else return check(val)
    }
  }

  var contains = scopes('foo')
  assert.equal(contains('foo bar test qux quz'), true)
  assert.equal(contains('bar test qux quz foo'), true)
  assert.equal(contains('bar test foo qux quz'), true)
  assert.equal(contains('test test foo qux quz'), true)

  var doesNotContain = scopes('foo')
  assert.equal(doesNotContain('bar test qux quz'), false)
  assert.equal(doesNotContain('foobar test qux quz'), false)
  assert.equal(doesNotContain('bar test qux quzfoo'), false)
  assert.equal(doesNotContain('foo:qux bar test quz'), false)
  assert.equal(doesNotContain('foo-qux bar test quz'), false)
  assert.equal(doesNotContain('foo*qux bar test quz'), false)
  assert.equal(doesNotContain('foo1qux bar test quz'), false)
  assert.equal(doesNotContain('foo_qux bar test quz'), false)
  assert.equal(doesNotContain('foo±qux bar test quz'), false)
  assert.equal(doesNotContain('foo😄qux bar test quz'), false)
  assert.equal(doesNotContain('foo,foo bar test quz'), false)

  var multimatch = scopes('first second third')
  assert.equal(multimatch('this must match multiple scopes'), false)
  assert.equal(multimatch('not only the first and second'), false)
  assert.equal(multimatch('all of them, the first second and third'), true)

  var mandatoryScopeAsString = scopes('foo bar')
  assert.equal(mandatoryScopeAsString('foo test qux quz'), false)
  assert.equal(mandatoryScopeAsString('foobar test qux quz'), false)
  assert.equal(mandatoryScopeAsString('bar test quz'), false)
  assert.equal(mandatoryScopeAsString('foo test bar quz'), true)

  var m = mandatoryAsArray ? 'array' : 'string'
  var s = scopeAsArray ? 'array' : 'string'
  console.log(`Tests executed, mandatory as ${m}, scopes as ${s}`)
}
