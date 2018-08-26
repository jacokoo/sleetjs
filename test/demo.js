const {compile} = require('../')

const input = `
@mixin#demo(name='username' type='text')
    input(name=$name type=$type)

mixin#demo
mixin#demo(name='password' type='password')
`
console.log(compile(input, {}).code)
