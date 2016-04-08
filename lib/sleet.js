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
        var context = new _context.Context(options, result.nodes, result.indent);
        context.doCompile();
        return context.getOutput();
    } catch (e) {
        if (e instanceof parser.SyntaxError) {
            throw new Error(e.message + ' [line: ' + e.line + ', column: ' + e.column + ']');
        } else {
            throw e;
        }
    }
}