'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MixinDefinitionCompiler = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tag = require('./tag');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MixinDefinitionCompiler = exports.MixinDefinitionCompiler = function (_TagCompiler) {
    _inherits(MixinDefinitionCompiler, _TagCompiler);

    function MixinDefinitionCompiler() {
        _classCallCheck(this, MixinDefinitionCompiler);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(MixinDefinitionCompiler).apply(this, arguments));
    }

    _createClass(MixinDefinitionCompiler, [{
        key: 'compile',
        value: function compile(context, tag) {
            if (!tag.hash) {
                throw new Error('Hash property is required for block definition. eg. @mixin#name');
            }

            if (tag.indent !== 0) {
                throw new Error('Block definition must be placed in top level(the indent of it must be 0)');
            }

            var ctx = context.sub(tag, -2);
            ctx.compileChildren();
            var result = ctx.getOutput(true);
            var group = tag.attributeGroups && tag.attributeGroups[0];
            var replacement = {};

            group.attributes.forEach(function (item) {
                var value = context.getCompiler(item).getValue(context, item.value, item, group, tag);
                item.name ? replacement[item.name] = value : replacement[value] = null;
            });

            context.root.getNote('mixin').set(tag.hash, { result: result, replacement: replacement });
        }
    }]);

    return MixinDefinitionCompiler;
}(_tag.TagCompiler);