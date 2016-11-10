var assert = require('assert')

test(false, false)
test(false, true)
test(true, false)
test(true, true)

function test (mandatoryAsArray, scopeAsArray) {
  function scopes (mandatory) {
    var mod = require('./index')
    var check
    if (mandatoryAsArray) check = mod(mandatory.split(' '))
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

  var caseSensitive = scopes('foo')
  assert.equal(caseSensitive('foo'), true)
  assert.equal(caseSensitive('FOO'), false)
  assert.equal(caseSensitive('Foo'), false)

  // Boolean expressions
  var expression1 = scopes('first && second && !third')
  assert.equal(expression1('foo'), false)
  assert.equal(expression1('first'), false)
  assert.equal(expression1('first second'), true)
  assert.equal(expression1('first second another'), true)
  assert.equal(expression1('first second another third'), false)

  var expression2 = scopes('first || second')
  assert.equal(expression2('foo'), false)
  assert.equal(expression2('first'), true)
  assert.equal(expression2('foo second'), true)
  assert.equal(expression2('first second'), true)

  var expression3 = scopes('!first || (second && third && !fourth)')
  assert.equal(expression3('foo'), true)
  assert.equal(expression3('first'), false)
  assert.equal(expression3('first second'), false)
  assert.equal(expression3('first second third'), true)
  assert.equal(expression3('second third'), true)
  assert.equal(expression3('first second third foo fourth'), false)

  var expression4 = scopes('NOT first AND second')
  assert.equal(expression4('foo'), false)
  assert.equal(expression4('first'), false)
  assert.equal(expression4('foo first'), false)
  assert.equal(expression4('second'), true)
  assert.equal(expression4('second third'), true)

  var expression5 = scopes('NOT (first AND second)')
  assert.equal(expression5('foo'), true)
  assert.equal(expression5('first'), true)
  assert.equal(expression5('second'), true)
  assert.equal(expression5('first second'), false)
  assert.equal(expression5('first second foo'), false)

  var ORkeyword = scopes('first OR second')
  assert.equal(ORkeyword('foo bar'), false)
  assert.equal(ORkeyword('first foo bar'), true)
  assert.equal(ORkeyword('second foo bar'), true)

  var m = mandatoryAsArray ? 'array' : 'string'
  var s = scopeAsArray ? 'array' : 'string'
  console.log(`Tests executed, mandatory as ${m}, scopes as ${s}`)
}
