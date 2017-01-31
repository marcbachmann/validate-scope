/* eslint-disable no-new-func, no-useless-escape */
var safeRegexPattern = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g
var isExpression = /(AND|OR|!|&|\|)/
var booleanExpression = require('boolean-expression')

module.exports = function getValidate (expression) {
  if (Array.isArray(expression)) expression = expression.join(' ')
  if (!isExpression.test(expression)) expression = expression.split(' ').filter(Boolean).join(' && ')
  expression = booleanExpression(expression)

  var checkArray = expression(function (value) {
    return '!!~scopes.indexOf(\'' + value + '\')'
  })

  var declations = []
  var checkString = expression(function (value, i) {
    value = value.replace(safeRegexPattern, '\\$&')
    declations.push('var a' + i + ' = /(?:^|\\\s)' + value + '(?:\\\s|$)/')
    return 'a' + i + '.test(scopes)'
  })

  return new Function([declations.join('\n'),
    'return function validate (scopes) {',
    '  if (typeof scopes === \'string\') return ' + checkString,
    '  return ' + checkArray,
    '}'].join('\n'))()
}
