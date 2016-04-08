const sleet = require('./lib/sleet');
const input = `#! handlebars hbs a=1 b=2
c
  a > uglify > coffee(bare=false a = 1 b='a').
      a = (x) -> x * x
      b = a 2
      console.log b
      c = (x) ->
          a(x) + a(x)
`

const result = sleet.compile(input, {a: 1});
console.log(result);
