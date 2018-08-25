import {compile} from '../sleet'

const input = `#! html
a
  b
  c + d
  e
`
console.log(compile(input, {}))
