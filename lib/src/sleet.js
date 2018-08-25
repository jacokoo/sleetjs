"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast = require("./ast");
const parser = require("./parser");
const html_1 = require("./html");
function compile(input, options) {
    const result = parser.parse(input, { ast });
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
    if (name && typeof name === 'string') {
        if (name.slice(0, 6) === 'sleet-')
            name = name.slice(6);
        name = require(name);
    }
    if (!name)
        name = html_1.default;
    return name.compile(result, options);
}
exports.compile = compile;
//# sourceMappingURL=sleet.js.map