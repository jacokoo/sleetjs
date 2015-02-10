{compile} = require './compiler'

html = """
a.id
  b#a
  c abc
  d(a=a b=b, c="c&c") .
    var demo = [];
    demo.push('a');
  e(
    e1 = 1
    e2 = ab {}
  )
"""

console.log(compile html)
