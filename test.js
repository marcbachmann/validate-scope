const assert = require('assert')

// Test validation method
test(false, 'string')
test(false, 'array')
test(false, 'set')
test(true, 'string')
test(true, 'array')
test(true, 'set')

// Test scopes that are contained in expression
const scope = require('./index')
assert.deepEqual(scope('foo*qux bar test quz').scopes, ['foo*qux', 'bar', 'test', 'quz'])
assert.deepEqual(scope('NOT first AND second').scopes, ['first', 'second'])
assert.deepEqual(
  scope('!first || (second && third && !fourth)').scopes,
  ['first', 'second', 'third', 'fourth']
)

function test (mandatoryAsArray, scopeAs = 'string') {
  function scopes (mandatory) {
    const mod = require('./index')
    let check
    if (mandatoryAsArray) check = mod(mandatory.split(' '))
    else check = mod(mandatory)

    return function (val) {
      if (scopeAs === 'array') return check(val.split(' '))
      else if (scopeAs === 'set') return check(new Set(val.split(' ')))
      else return check(val)
    }
  }

  const contains = scopes('foo')
  assert.equal(contains('foo bar test qux quz'), true)
  assert.equal(contains('bar test qux quz foo'), true)
  assert.equal(contains('bar test foo qux quz'), true)
  assert.equal(contains('test test foo qux quz'), true)

  const doesNotContain = scopes('foo')
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

  const multimatch = scopes('first second third')
  assert.equal(multimatch('this must match multiple scopes'), false)
  assert.equal(multimatch('not only the first and second'), false)
  assert.equal(multimatch('all of them, the first second and third'), true)

  const mandatoryScopeAsString = scopes('foo bar')
  assert.equal(mandatoryScopeAsString('foo test qux quz'), false)
  assert.equal(mandatoryScopeAsString('foobar test qux quz'), false)
  assert.equal(mandatoryScopeAsString('bar test quz'), false)
  assert.equal(mandatoryScopeAsString('foo test bar quz'), true)

  const caseSensitive = scopes('foo')
  assert.equal(caseSensitive('foo'), true)
  assert.equal(caseSensitive('FOO'), false)
  assert.equal(caseSensitive('Foo'), false)

  // Boolean expressions
  const expression1 = scopes('first && second && !third')
  assert.equal(expression1('foo'), false)
  assert.equal(expression1('first'), false)
  assert.equal(expression1('first second'), true)
  assert.equal(expression1('first second another'), true)
  assert.equal(expression1('first second another third'), false)

  const expression2 = scopes('first || second')
  assert.equal(expression2('foo'), false)
  assert.equal(expression2('first'), true)
  assert.equal(expression2('foo second'), true)
  assert.equal(expression2('first second'), true)

  const expression3 = scopes('!first || (second && third && !fourth)')
  assert.equal(expression3('foo'), true)
  assert.equal(expression3('first'), false)
  assert.equal(expression3('first second'), false)
  assert.equal(expression3('first second third'), true)
  assert.equal(expression3('second third'), true)
  assert.equal(expression3('first second third foo fourth'), false)

  const expression4 = scopes('NOT first AND second')
  assert.equal(expression4('foo'), false)
  assert.equal(expression4('first'), false)
  assert.equal(expression4('foo first'), false)
  assert.equal(expression4('second'), true)
  assert.equal(expression4('second third'), true)

  const expression5 = scopes('NOT (first AND second)')
  assert.equal(expression5('foo'), true)
  assert.equal(expression5('first'), true)
  assert.equal(expression5('second'), true)
  assert.equal(expression5('first second'), false)
  assert.equal(expression5('first second foo'), false)

  const ORkeyword = scopes('first OR second')
  assert.equal(ORkeyword('foo bar'), false)
  assert.equal(ORkeyword('first foo bar'), true)
  assert.equal(ORkeyword('second foo bar'), true)

  const m = mandatoryAsArray ? 'array' : 'string'
  console.log(`Tests executed, mandatory as ${m}, scopes as ${scopeAs}`)
}
