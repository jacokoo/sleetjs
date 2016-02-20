require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./app/compile/index":[function(require,module,exports){
'use strict';

var sleet = require('sleet');
var handlebars = require('handlebars-sleet');
var templates = {
    sleet: '#!handlebars block=helper\n\ndoctype html\nhtml\n    head\n        meta(charset=\'utf-8\')\n        title Welcom to Sleetjs\n        link(rel=\'stylesheet\' href=\'index.css\')\n\n        # script\n        script(type=\'text/javascript\') > uglify(mingle=true) > coffee.\n            number = 2\n            square = (x) -> x * x\n            console.log square number\n\n        # ie conditional comment\n        ieif(\'lt IE 8\') > script(src=\'hello.js\')\n        @ieif(\'gte IE 8\')\n            script(src=\'script.js\')\n    body\n        .container > p.\n            This\n            is\n            a text block\n        #footer\n            p The end\n\n        # handlebars\n        ul.list-group > each(items)\n            li.list-group-item > a(id=\'item-\' + id) > echo(name)\n\n        helper(arg 1 \'a\')\n            p inside the helper\n        else\n            p the reverse part',
    html: '<!--\n    convert html/handlebars to sleet\n-->\n\n<!DOCTYPE html>\n<html>\n    <head>\n        <meta charset="utf-8">\n        <title>Welcom to Sleetjs</title>\n        <script type="text/javascript">\n            var a = 10;\n            console.log(a);\n        </script>\n    </head>\n    <body>\n        <!-- multiple line text -->\n        <p>\n            first line\n            second line\n        </p>\n\n        <!-- handlebars -->\n        <ul class="list-group">{{#each items}}\n            <li class="list-group-item"><a id="item-{{id}}">{{name}}</a></li>\n        {{/each}}</ul>\n    </body>\n</html>\n'
};

exports.items = {
    input: 'input',
    output: 'output'
};

exports.store = {
    models: {
        state: { data: { from: 'sleet', to: 'HTML/Handlebars' } },
        input: { data: templates.sleet },
        output: ''
    },

    callbacks: {
        compile: function compile(payload) {
            var input = payload && payload.input || this.models.input.data;
            var compiler = this.models.state.data.from === 'sleet' ? sleet.compile : handlebars.convert;
            var output = undefined;
            try {
                output = compiler(input);
                output.content && (output = output.content);
            } catch (e) {
                output = e.message;
            }

            this.models.output.set(output, true);
        },

        reverseIt: function reverseIt() {
            var model = this.models.state,
                tpl = model.data.from === 'sleet' ? templates.html : templates.sleet;
            model.set({
                from: model.data.to,
                to: model.data.from
            }, true);

            this.models.input.set(tpl, true);
            this.module.dispatch('compile', { input: tpl });
        }
    }
};

exports.afterRender = function () {
    this.dispatch('compile');
};

},{"handlebars-sleet":"handlebars-sleet","sleet":"sleet"}],"./app/compile/templates":[function(require,module,exports){
var templater = require("handlebars/runtime")["default"].template;module.exports = templater({"1":function(container,depth0,helpers,partials,data) {
    return "<div class=\"container\">\n    <h3>Try Sleet Online</h3>\n    <div class=\"left\" data-region=\"input\"></div>\n    <div class=\"right\" data-region=\"output\"></div>\n</div>";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.escapeExpression;

  return "    <p>\n        Type \n        <span id=\"from\">"
    + alias1(container.lambda(((stack1 = (depth0 != null ? depth0.state : depth0)) != null ? stack1.from : stack1), depth0))
    + " </span>\n        <a id=\"reverse\" href=\"javascript:;\">[Reverse]</a>\n    </p>\n    <div id=\"input\" class=\"input\">"
    + alias1(((helper = (helper = helpers.input || (depth0 != null ? depth0.input : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"input","hash":{},"data":data}) : helper)))
    + "</div>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : {};

  return "    <p>Compiles to <span id=\"to\">"
    + alias1(container.lambda(((stack1 = (depth0 != null ? depth0.state : depth0)) != null ? stack1.to : stack1), depth0))
    + "</span></p>\n    <div id=\"result\" class=\"output "
    + ((stack1 = helpers["if"].call(alias2,((stack1 = (depth0 != null ? depth0.code : depth0)) != null ? stack1.haveError : stack1),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">"
    + alias1(((helper = (helper = helpers.output || (depth0 != null ? depth0.output : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias2,{"name":"output","hash":{},"data":data}) : helper)))
    + "</div>\n";
},"6":function(container,depth0,helpers,partials,data) {
    return "error";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, buffer = "";

  stack1 = ((helper = (helper = helpers.module || (depth0 != null ? depth0.module : depth0)) != null ? helper : alias2),(options={"name":"module","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(alias1,options) : helper));
  if (!helpers.module) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n"
    + ((stack1 = (helpers.view || (depth0 && depth0.view) || alias2).call(alias1,"input",{"name":"view","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.view || (depth0 && depth0.view) || alias2).call(alias1,"output",{"name":"view","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
},{"handlebars/runtime":"handlebars/runtime"}],"./app/compile/view-input":[function(require,module,exports){
'use strict';

exports.bindings = {
    input: 'setInput',
    state: 'setState'
};

exports.setState = function () {
    var from = this.bindings.state.data.from,
        comp = this.components.input;
    this.$('from').innerHTML = from;
    comp.getSession().setMode('ace/mode/' + (from === 'sleet' ? 'sleet' : 'handlebars'));
};

exports.setInput = function () {
    this.components.input.setValue(this.bindings.input.data, -1);
};

exports.actions = {
    'click reverse': 'reverseIt'
};

exports.components = [{
    id: 'input', name: 'ace', options: { mode: 'sleet' }
}];

exports.mixin = {
    changed: function changed(code) {
        this.module.dispatch('compile', { input: code });
    }
};

},{}],"./app/compile/view-output":[function(require,module,exports){
'use strict';

exports.bindings = {
    output: 'reset',
    state: 'setState'
};

exports.setState = function () {
    var to = this.bindings.state.data.to,
        comp = this.components.result;
    this.$('to').innerHTML = to;
    comp.getSession().setMode('ace/mode/' + (to === 'sleet' ? 'sleet' : 'handlebars'));
};

exports.reset = function () {
    this.components.result.setValue(this.bindings.output.data, -1);
};

exports.components = [{
    id: 'result', name: 'ace', options: { mode: 'handlebars', readonly: true }
}];

},{}],"./app/ext/ace":[function(require,module,exports){
'use strict';

var D = require('drizzlejs');

D.ComponentManager.register('ace', function (view, el) {
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
    var editor = ace.edit(el);var mode = options.mode;
    var readonly = options.readonly;


    editor.setTheme('ace/theme/monokai');
    mode && editor.getSession().setMode('ace/mode/' + mode);
    readonly && editor.setReadOnly(true);

    editor.$blockScrolling = Infinity;

    editor.on('change', function () {
        view.changed && view.changed(editor.getValue());
    });
    return editor;
}, function (view, comp) {
    comp.destroy();
});

},{"drizzlejs":"drizzlejs"}],"./app/viewport/index":[function(require,module,exports){
'use strict';

exports.items = {
    header: 'header',
    footer: 'footer',
    compile: { region: 'content', isModule: true }
};

},{}],"./app/viewport/templates":[function(require,module,exports){
var templater = require("handlebars/runtime")["default"].template;module.exports = templater({"1":function(container,depth0,helpers,partials,data) {
    return "    <section class=\"page-header\" data-region=\"header\"></section>\n    <section class=\"main-content\">\n        <div data-region=\"content\"></div>\n        <footer class=\"site-footer\" data-region=\"footer\"></footer>\n    </section>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "    <h1 class=\"project-name\">Sleet</h1>\n    <h2 class=\"project-tagline\">A litte language that compiles into HTML</h2>\n    <a class=\"btn\" href=\"https://github.com/jacokoo/sleetjs\">View on GitHub</a>\n    <a class=\"btn\" href=\"https://github.com/jacokoo/sleetjs/zipball/master\">Download .zip</a>\n    <a class=\"btn\" href=\"https://github.com/jacokoo/sleetjs/tarball/master\">Download .tar.gz</a>\n";
},"5":function(container,depth0,helpers,partials,data) {
    return "    <span class=\"site-footer-owner\">\n        <a href=\"https://github.com/jacokoo/sleetjs\">Sleet</a>\n        is maintained by\n        <a href=\"https://github.com/jacokoo\">jacokoo</a>\n        .\n    </span>\n    <span class=\"site-footer-credits\">This page was generated by\n        <a href=\"https://pages.github.com\">GitHub Pages</a>\n        using the\n        <a href=\"https://github.com/jasonlong/cayman-theme\">Cayman theme</a>\n        by\n        <a href=\"https://twitter.com/jasonlong\">Jason Long</a>\n        .\n    </span>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, buffer = "";

  stack1 = ((helper = (helper = helpers.module || (depth0 != null ? depth0.module : depth0)) != null ? helper : alias2),(options={"name":"module","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(alias1,options) : helper));
  if (!helpers.module) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + ((stack1 = (helpers.view || (depth0 && depth0.view) || alias2).call(alias1,"header",{"name":"view","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = (helpers.view || (depth0 && depth0.view) || alias2).call(alias1,"footer",{"name":"view","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
},{"handlebars/runtime":"handlebars/runtime"}],"./app/viewport/view-footer":[function(require,module,exports){
"use strict";

},{}],"./app/viewport/view-header":[function(require,module,exports){
"use strict";

},{}],1:[function(require,module,exports){
'use strict';

require('./app/ext/ace');

var D = require('drizzlejs');
var H = require('handlebars/runtime');

var app = window.app = new D.Application({
    getResource: function getResource(path) {
        return require('./' + path);
    }
});

H.registerHelper('module', function (options) {
    return this.Self instanceof D.Module ? options.fn(this) : '';
});

H.registerHelper('view', function (name, options) {
    return this.Self instanceof D.View && this.Self.name === name ? options.fn(this) : '';
});

app.start();

},{"./app/ext/ace":"./app/ext/ace","drizzlejs":"drizzlejs","handlebars/runtime":"handlebars/runtime"}]},{},[1]);

//# sourceMappingURL=main.js.map
