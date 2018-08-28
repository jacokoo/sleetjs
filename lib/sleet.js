"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("./parser");
exports.parse = parser_1.parse;
const context_1 = require("./context");
exports.Context = context_1.Context;
__export(require("./ast"));
class AbstractCompiler {
    constructor(node, stack) {
        this.node = node;
        this.stack = stack.concat(node);
    }
}
exports.AbstractCompiler = AbstractCompiler;
class SleetStack {
    constructor(items, notes = {}) {
        this.items = items || [];
        this._notes = notes;
    }
    last(type) {
        if (!type)
            return this.items[this.items.length - 1];
        for (let i = this.items.length - 1; i >= 0; i--) {
            if (this.items[i].node.type === type)
                return this.items[i];
        }
    }
    concat(item) {
        let its;
        if (Array.isArray(item)) {
            its = this.items.concat(item.map(it => {
                return { node: it, note: {} };
            }));
        }
        else {
            its = this.items.concat({ node: item, note: {} });
        }
        return new SleetStack(its, this._notes);
    }
    note(key) {
        return this._notes[key];
    }
}
exports.SleetStack = SleetStack;
function compile(input, options) {
    const result = parser_1.parse(input, options.ignoreSetting !== false);
    if (options.compile) {
        return options.compile(result, options);
    }
    let name = '';
    if (result.declaration) {
        name = result.declaration.name;
    }
    if (!name && options.defaultPlugin)
        name = options.defaultPlugin;
    if (name && typeof name === 'string') {
        if (name.slice(0, 6) === 'sleet-')
            name = name.slice(6);
        if (options.plugins && options.plugins[name])
            name = options.plugins[name];
    }
    if (!name)
        name = 'html';
    if (name && typeof name === 'string') {
        const o = require(`sleet-${name}`);
        name = o.plugin;
    }
    const context = new context_1.Context(options, 0, result.indent, options.newLineToken || '\n');
    const plugin = name;
    if (plugin.prepare)
        plugin.prepare(context);
    return plugin.compile(result, options, context);
}
exports.compile = compile;
