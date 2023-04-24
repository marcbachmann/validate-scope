/* eslint-disable no-new-func, no-useless-escape */
const safeRegexPattern = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g
const isExpression = /(AND|OR|!|&|\|)/
const booleanExpression = require('boolean-expression')

module.exports = function getValidate (expression) {
  if (Array.isArray(expression)) expression = expression.join(' ')
  if (!isExpression.test(expression)) expression = expression.split(' ').filter(Boolean).join(' && ')
  expression = booleanExpression(expression)

  const checkArray = expression.toString(function (value) {
    return `scopes.includes(${JSON.stringify(value)})`
  })

  const declations = []
  const checkString = expression.toString(function (value, i) {
    value = value.replace(safeRegexPattern, '\\$&')
    declations.push(`const a${i} = /(?:^|\\\s)${value}(?:\\\s|$)/`)
    return `a${i}.test(scopes)`
  })

  const validate = new Function([declations.join('\n'),
    'return function validate (scopes) {',
    `  if (typeof scopes === 'string') return ${checkString}`,
    `  return ${checkArray}`,
    '}'
  ].join('\n'))()

  validate.scopes = expression.toTokens()
  return validate
}
