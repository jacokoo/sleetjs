'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.IncludeCompiler = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tag = require('./tag');

var _parser = require('../parser');

var _tag2 = require('../ast/tag');

var _declaration = require('../ast/declaration');

var _attribute = require('../ast/attribute');

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _path = require('path');

var path = _interopRequireWildcard(_path);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IncludeCompiler = exports.IncludeCompiler = function (_TagCompiler) {
    _inherits(IncludeCompiler, _TagCompiler);

    function IncludeCompiler() {
        _classCallCheck(this, IncludeCompiler);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(IncludeCompiler).apply(this, arguments));
    }

    _createClass(IncludeCompiler, [{
        key: 'compile',
        value: function compile(context, tag) {
            var ctx = context;
            var file = tag.attributeGroups[0].attributes[0].value[0].value;
            var dir = ctx.options.filename || path.resolve('.');
            if (fs.statSync(dir).isFile()) dir = path.dirname(dir);
            file = path.resolve(dir, file);

            var code = fs.readFileSync(file, 'utf8');

            var _parse = (0, _parser.parse)(code, { Tag: _tag2.Tag, Declaration: _declaration.Declaration, Attribute: _attribute.Attribute });

            var nodes = _parse.nodes;


            nodes.forEach(function (node) {
                return ctx.sub(node, -1);
            });

            ctx.compileChildren();
            ctx.parent.containsIndent = ctx.containsIndent;
        }
    }]);

    return IncludeCompiler;
}(_tag.TagCompiler);