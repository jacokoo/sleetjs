"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("./parser");
const context_1 = require("./context");
function compile(input, options) {
    const result = parser_1.parse(input);
    if (options.compile) {
        return options.compile(result, options);
    }
    let name = '';
    if (result.declaration) {
        name = result.declaration.name;
    }
    if (!name && options.defaultPlugin)
        name = options.defaultPlugin;
    if (name && typeof name === 'string' && options.plugins && options.plugins[name]) {
        name = options.plugins[name];
    }
    if (!name)
        name = 'html';
    if (name && typeof name === 'string') {
        if (name.slice(0, 6) === 'sleet-')
            name = name.slice(6);
        const o = require(name);
        name = o.plugin;
    }
    const context = new context_1.Context(options, 0, result.indent, options.newLineToken || '\n');
    const plugin = name;
    plugin.prepare(context);
    return plugin.compile(result, options, context);
}
exports.compile = compile;
