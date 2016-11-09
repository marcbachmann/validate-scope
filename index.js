/* eslint-disable no-new-func, no-useless-escape */
module.exports = function getValidate (mandatory) {
  if (typeof mandatory === 'string') mandatory = mandatory.split(' ')

  return new Function(`
    ${map(mandatory, 'var a:1 = /(?:^|\\\s):0(?:\\\s|$)/').join('\n  ')}

    return function validate (scopes) {
      if (typeof scopes === 'string') {
        ${map(mandatory, 'if (!a:1.test(scopes)) return false').join('\n        ')}
      } else {
        ${map(mandatory, 'if (!~scopes.indexOf(":0")) return false').join('\n        ')}
      }
      return true
    }
  `)()
}

function map (arr, template) {
  return arr.map(function (el, i) {
    return template.replace(':0', el).replace(':1', i)
  })
}
