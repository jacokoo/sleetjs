'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.compile = compile;

var _parser = require('./parser');

var parser = _interopRequireWildcard(_parser);

var _tag = require('./ast/tag');

var _declaration = require('./ast/declaration');

var _attribute = require('./ast/attribute');

var _context = require('./context');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function compile(input) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    try {
        var result = parser.parse(input, { Tag: _tag.Tag, Declaration: _declaration.Declaration, Attribute: _attribute.Attribute });
        var context = new _context.Context(options, null, options.indentToken || result.indent);
        var extension = null;

        if (result.declaration) {
            var name = result.declaration.name;

            extension = result.declaration.extension;

            if (options[name] && options[name].overrideContext) {
                options[name].overrideContext(context, options, result.declaration);
            } else if (name.slice(0, 6) === 'sleet-') {
                var mod = require(name);
                mod.overrideContext(context, options, result.declaration);
                extension || (extension = mod.getDefaultExtension());
            } else if (name !== 'sleet') {
                var _mod = require('sleet-' + name);
                _mod.overrideContext(context, options, result.declaration);
                extension || (extension = _mod.getDefaultExtension());
            }
        }

        context.doCompile(result.nodes);
        return { content: context.getOutput(), extension: extension || options.extension || 'html' };
    } catch (e) {
        if (e instanceof parser.SyntaxError) {
            throw new Error(e.message + ' [line: ' + e.line + ', column: ' + e.column + ']');
        } else {
            throw e;
        }
    }
}