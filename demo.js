const sleet = require('./lib/sleet');
const input = `#! handlebars hbs a=1 b=2
a > b
`

const result = sleet.compile(input);
console.dir(result.nodes, {depth: null});
