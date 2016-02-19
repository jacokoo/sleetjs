require('./app/ext/ace');

const D = require('drizzlejs');
const H = require('handlebars/runtime');

const app = window.app = new D.Application({
    getResource: (path) => require(`./${path}`)
});

H.registerHelper('module', function(options) {
    return (this.Self instanceof D.Module) ? options.fn(this) : '';
});

H.registerHelper('view', function(name, options) {
    return (this.Self instanceof D.View) && this.Self.name === name ? options.fn(this) : '';
});

app.start();
