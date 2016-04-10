'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MixinReferenceCompiler = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tag = require('./tag');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MixinReferenceCompiler = exports.MixinReferenceCompiler = function (_TagCompiler) {
    _inherits(MixinReferenceCompiler, _TagCompiler);

    function MixinReferenceCompiler() {
        _classCallCheck(this, MixinReferenceCompiler);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(MixinReferenceCompiler).apply(this, arguments));
    }

    _createClass(MixinReferenceCompiler, [{
        key: 'compile',
        value: function compile(context, tag) {
            if (!tag.hash) {
                throw new Error('Hash property is required for block reference. eg. block#name');
            }

            var def = context.root.getNote('mixin').get(tag.hash);
            this.startIndent(context, tag);
            var indent = context.last(1);
            var replacement = {};
            var keys = Object.keys(def.replacement);
            keys.forEach(function (item) {
                return replacement[item] = def.replacement[item];
            });

            if (tag.attributeGroups) {
                (function () {
                    var group = tag.attributeGroups[0];
                    group.attributes.forEach(function (item) {
                        if (!item.name) return;
                        if (!replacement.hasOwnProperty(item.name)) return;

                        replacement[item.name] = context.getCompiler(item).getValue(context, item.value, item, group, tag);
                    });
                })();
            }

            def.result.forEach(function (item) {
                if (item.indexOf('$') > -1) {
                    context.push(keys.reduce(function (acc, k) {
                        return acc.replace(new RegExp('\\$' + k, 'g'), replacement[k]);
                    }, item));
                    return;
                }

                context.push(item);
                if (item === '\n') context.push(indent);
            });
        }
    }]);

    return MixinReferenceCompiler;
}(_tag.TagCompiler);