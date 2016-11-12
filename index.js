/* eslint-disable no-new-func, no-useless-escape */
var safeRegexPattern = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g
var isExpression = /(AND|OR|!|&|\|)/

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

var allOperators = /(!|&&| AND | OR | NOT |\|\||\(|\)| )/g
function booleanExpression (exp) {
  exp = exp.split(allOperators).filter(Boolean).reduce(rewrite, [])
  return function toString (map) {
    return exp.map(function (t, i, exp) {
      if (t.type === 'operator') return t.value
      return (map || expressionToString)(t.value, i)
    }).join(' ')
  }
}

var nativeOperators = /^(!|&&|\|\||\(|\))$/
var operatorMap = {OR: '||', AND: '&&', NOT: '!'}
function rewrite (ex, el, i, all) {
  var t = el.trim()
  if (!t) return ex
  if (operatorMap[t]) t = operatorMap[t]
  if (nativeOperators.test(t)) ex.push({type: 'operator', value: t})
  else ex.push({type: 'token', value: t.replace(/['\\]/g, '\\$&')})
  return ex
}

function expressionToString (token) { return token }
