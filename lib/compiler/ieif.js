'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.IeifCompiler = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tag = require('./tag');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IeifCompiler = exports.IeifCompiler = function (_TagCompiler) {
    _inherits(IeifCompiler, _TagCompiler);

    function IeifCompiler(closeIt) {
        _classCallCheck(this, IeifCompiler);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(IeifCompiler).call(this));

        _this.closeIt = closeIt;
        return _this;
    }

    _createClass(IeifCompiler, [{
        key: 'tagStart',
        value: function tagStart(context) {
            context.push('<!--[if ');
        }
    }, {
        key: 'openEnd',
        value: function openEnd(context) {
            context.push(this.closeIt ? ']><!-->' : ']>');
        }
    }, {
        key: 'attributes',
        value: function attributes(context, tag) {
            if (!tag.attributeGroups || tag.attributeGroups.length < 1) return;

            var attr = tag.attributeGroups[0].attributes[0];
            context.push(attr && attr.value[0].value);
        }
    }, {
        key: 'closeStart',
        value: function closeStart() {}
    }, {
        key: 'closeEnd',
        value: function closeEnd(context) {
            context.push(this.closeIt ? '<!--<![endif]-->' : '<![endif]-->');
        }
    }]);

    return IeifCompiler;
}(_tag.TagCompiler);