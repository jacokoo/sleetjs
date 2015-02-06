{compile} = require './compiler'

html = """
a.id
  b#a
  c abc
  d
  d.
    fjdksla
    fds
    aa
"""

console.log(compile html)
