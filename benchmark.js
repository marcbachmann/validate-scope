var bench = require('nanobench')
var mandatory = ['user:edit']
var scopes = 'user:edit document:write document:read list:manage user:archive'

bench('validate("some space separate scopes")', function (b) {
  var scope = require('./')(mandatory)
  b.start()

  for (var i = 0; i < 10e7; i++) {
    scope(scopes)
  }

  b.end()
})

bench('validate(["some", "scopes", "as", "array"])', function (b) {
  var scope = require('./')(mandatory)
  var arr = scopes.split(' ')
  b.start()

  for (var i = 0; i < 10e7; i++) {
    scope(arr)
  }

  b.end()
})

bench('traditional string split & array indexOf', function (b) {
  var scope = mandatory
  var arr
  b.start()

  for (var i = 0; i < 10e7; i++) {
    arr = scopes.split(' ')
    for (var j = 0; j < scope.length; j++) {
      if (arr.indexOf(scope[j]) === -1) continue
    }
  }

  b.end()
})

bench('traditional for loop & array indexOf', function (b) {
  var scope = mandatory
  var arr = scopes.split(' ')
  b.start()

  for (var i = 0; i < 10e7; i++) {
    contains(scope, arr)
  }

  b.end()
})

function contains (mandatory, scopes) {
  for (var i = 0; i < mandatory.length; i++) {
    if (!~scopes.indexOf(mandatory[i])) return false
  }
  return true
}
