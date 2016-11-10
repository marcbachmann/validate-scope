/* eslint-disable no-new-func, no-useless-escape */
var allOperators = /(!|&&| AND | OR | NOT |\|\||\(|\)| )/g
module.exports = function getValidate (expression) {
  if (Array.isArray(expression)) expression = expression.join(' ')
  if (!/(AND|OR|!|&|\|)/.test(expression)) expression = expression.split(' ').filter(Boolean).join(' && ')

  var segments = expression.split(allOperators).filter(Boolean)
  var checkArray = segments.reduce(gen(true).func, []).join(' ')

  var reducer = gen(false)
  var checkString = segments.reduce(reducer.func, []).join(' ')
  var tokens = reducer.tokens.map(toRegExDeclaration).join('\n')

  return new Function([tokens,
    'return function validate (scopes) {',
    '  if (typeof scopes === \'string\') return ' + checkString,
    '  return ' + checkArray,
    '}'].join('\n'))()
}

var nativeOperators = /^(!|&&|\|\||\(|\))$/
function gen (checkArray) {
  var tokens = []
  return {
    tokens: tokens,
    func: function rewrite (r, el, i, all) {
      var t = el.trim()
      if (!t) return r
      if (nativeOperators.test(el)) r.push(el)
      else if (t === 'OR') r.push('||')
      else if (t === 'AND') r.push('&&')
      else if (t === 'NOT') r.push('!')
      else {
        r.push(el)

        var token = r[r.length - 1].replace(/['\\]/g, '\\$&')
        if (checkArray) r[r.length - 1] = '!!~scopes.indexOf(\'' + token + '\')'
        else r[r.length - 1] = 'a' + (tokens.push(token) - 1) + '.test(scopes)'
      }
      return r
    }
  }
}

function toRegExDeclaration (t, i) {
  t = t.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
  return 'var a:1 = /(?:^|\\\s):0(?:\\\s|$)/'.replace(':0', t).replace(':1', i)
}
