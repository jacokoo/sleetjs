{compile} = require './compiler'

html = """
a.id
  b#a
  c abc
  d(a=a b=b, c="c&c").
    var demo = []
    demo.push('a')
"""

console.log(compile html)
