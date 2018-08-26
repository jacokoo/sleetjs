const {compile} = require('../')

const input = `
# inline comment
#.
    this
    is

    a
    comment
    block

# inline comment 2
a
    #.
        comment
        block
    b
    c
        # comment

`
console.log(compile(input, {}).code)
