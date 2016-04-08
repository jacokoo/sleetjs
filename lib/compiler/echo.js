'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EchoCompiler = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tag = require('./tag');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EchoCompiler = exports.EchoCompiler = function (_TagCompiler) {
    _inherits(EchoCompiler, _TagCompiler);

    function EchoCompiler() {
        _classCallCheck(this, EchoCompiler);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(EchoCompiler).apply(this, arguments));
    }

    _createClass(EchoCompiler, [{
        key: 'compile',
        value: function compile(context, tag) {
            if (!tag.attributeGroups) return;
            this.startIndent(context, tag);

            var result = tag.attributeGroups.map(function (item) {
                return item.attributes.map(function (a) {
                    return a.value.map(function (v) {
                        return v.value;
                    }).join('');
                }).join('');
            });
            context.push(result.join(''));
        }
    }]);

    return EchoCompiler;
}(_tag.TagCompiler);