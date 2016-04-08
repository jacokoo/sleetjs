'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TextTagCompiler = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tag = require('./tag');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
};

var escapeHtml = function escapeHtml(string) {
    return string.replace(/[&<>"'`=\/]/g, function (s) {
        return map[s];
    });
};

var TextTagCompiler = exports.TextTagCompiler = function (_TagCompiler) {
    _inherits(TextTagCompiler, _TagCompiler);

    function TextTagCompiler() {
        _classCallCheck(this, TextTagCompiler);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(TextTagCompiler).apply(this, arguments));
    }

    _createClass(TextTagCompiler, [{
        key: 'compile',
        value: function compile(context, tag) {
            if (tag.text.length === 0) return;

            var escape = tag.firstAttribute;
            escape && (escape = escape.value[0].value === 'escape');

            context.eol();
            tag.text.forEach(function (item) {
                return context.indent().push(escape ? escapeHtml(item) : item).eol();
            });
            context.pop();
        }
    }]);

    return TextTagCompiler;
}(_tag.TagCompiler);