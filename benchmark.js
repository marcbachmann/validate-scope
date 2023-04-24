const bench = require('nanobench')
const mandatory = ['user:edit']
const scopes = 'user:edit document:write document:read list:manage user:archive'

bench('validate("some space separate scopes")', function (b) {
  const scope = require('./')(mandatory)
  b.start()

  for (let i = 0; i < 10e7; i++) {
    scope(scopes)
  }

  b.end()
})

bench('validate(["some", "scopes", "as", "array"])', function (b) {
  const scope = require('./')(mandatory)
  const arr = new Set(scopes.split(' '))
  b.start()

  for (let i = 0; i < 10e7; i++) {
    scope(arr)
  }

  b.end()
})

bench('validate(new Set(["some", "scopes", "as", "array"]))', function (b) {
  const scope = require('./')(mandatory)
  const arr = scopes.split(' ')
  b.start()

  for (let i = 0; i < 10e7; i++) {
    scope(arr)
  }

  b.end()
})

bench('traditional string split & array indexOf', function (b) {
  const scope = mandatory
  let arr
  b.start()

  for (let i = 0; i < 10e7; i++) {
    arr = scopes.split(' ')
    for (let j = 0; j < scope.length; j++) {
      if (arr.indexOf(scope[j]) === -1) continue
    }
  }

  b.end()
})

bench('traditional for loop & array indexOf', function (b) {
  const scope = mandatory
  const arr = scopes.split(' ')
  b.start()

  for (let i = 0; i < 10e7; i++) {
    contains(scope, arr)
  }

  b.end()
})

function contains (mandatory, scopes) {
  for (let i = 0; i < mandatory.length; i++) {
    if (!~scopes.indexOf(mandatory[i])) return false
  }
  return true
}
