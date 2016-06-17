'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AttributeCompiler = exports.AttributeCompiler = function () {
    function AttributeCompiler() {
        var joiner = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
        var booleanAttribute = arguments[1];

        _classCallCheck(this, AttributeCompiler);

        this._joiner = joiner;
        this._booleanAttribute = booleanAttribute;
    }

    _createClass(AttributeCompiler, [{
        key: 'compile',
        value: function compile(context, attribute, group, tag) {
            if (this._booleanAttribute) {
                context.push(' ' + attribute.name);
                return;
            }

            context.push(' ');
            this.generateName(context, attribute, group, tag);
            context.push('="');
            this.generateValue(context, attribute, group, tag);
            context.push('"');
        }
    }, {
        key: 'generateName',
        value: function generateName(context, attribute, group, tag) {
            if (attribute.name) {
                context.push(attribute.name);
                return;
            }
            this.generateValue(context, attribute, group, tag);
        }
    }, {
        key: 'generateValue',
        value: function generateValue(context, attribute, group, tag) {
            var _this = this;

            attribute.value.forEach(function (v) {
                context.push(context.getCompiler(v).compile(context, v, attribute, group, tag));
                context.push(_this.joiner);
            });
            context.pop();
        }
    }, {
        key: 'getValue',
        value: function getValue(context, value, attribute, group, tag) {
            if (!value) return null;
            return value.map(function (v) {
                return context.getCompiler(v).compile(context, v, attribute, group, tag);
            }).join(this.joiner);
        }
    }, {
        key: 'joiner',
        get: function get() {
            return this._joiner;
        }
    }]);

    return AttributeCompiler;
}();