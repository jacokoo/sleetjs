'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CommentCompiler = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tag = require('./tag');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CommentCompiler = exports.CommentCompiler = function (_TagCompiler) {
    _inherits(CommentCompiler, _TagCompiler);

    function CommentCompiler() {
        _classCallCheck(this, CommentCompiler);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CommentCompiler).apply(this, arguments));
    }

    _createClass(CommentCompiler, [{
        key: 'tagStart',
        value: function tagStart(context, tag) {
            context.push('<!--');
            if (tag.text.length === 1) context.push(' ');
        }
    }, {
        key: 'openEnd',
        value: function openEnd() {}
    }, {
        key: 'closeStart',
        value: function closeStart(context, tag) {
            if (tag.text.length === 1) context.push(' ');
            context.push('-->');
        }
    }, {
        key: 'closeEnd',
        value: function closeEnd() {}
    }]);

    return CommentCompiler;
}(_tag.TagCompiler);