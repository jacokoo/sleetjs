'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TransformerCompiler = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tag = require('./tag');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TransformerCompiler = exports.TransformerCompiler = function (_TagCompiler) {
    _inherits(TransformerCompiler, _TagCompiler);

    function TransformerCompiler() {
        _classCallCheck(this, TransformerCompiler);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(TransformerCompiler).apply(this, arguments));
    }

    _createClass(TransformerCompiler, [{
        key: 'compile',
        value: function compile(context, tag) {
            var content = this.getContent(context, tag);
            var options = this.getOptions(context, tag);

            var result = this.transform(context, content, options);
            var inline = !!tag.inlineChar;
            result.split('\n').forEach(function (item) {
                return context.eol().indent(inline ? 1 : 0).push(item);
            });
            inline && context.eol().indent();
        }
    }, {
        key: 'getContent',
        value: function getContent(context, tag) {
            var ctx = context;
            var idt = ctx._indent;
            ctx._indent = -1;
            this.content(ctx, tag);
            var content = ctx.getOutput();
            ctx._result = [];
            ctx._indent = idt;
            return content;
        }
    }, {
        key: 'getOptions',
        value: function getOptions(context, tag) {
            var options = {};
            if (!tag.attributeGroups) return options;

            tag.attributeGroups.forEach(function (group) {
                return group.attributes.forEach(function (attr) {
                    if (!attr.name) return;
                    options[attr.name] = attr.value[0].value;
                });
            });
            return options;
        }
    }, {
        key: 'transform',
        value: function transform() {}
    }]);

    return TransformerCompiler;
}(_tag.TagCompiler);