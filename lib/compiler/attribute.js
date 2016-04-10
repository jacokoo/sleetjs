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
        value: function compile(context, attribute, group, tag, note) {
            var value = this.getValue(context, attribute.value, attribute, group, tag);
            var name = attribute.name;

            if (this._booleanAttribute) {
                name = name || value;
                note.set(name, null);
                return;
            }

            if (!name) name = value;
            if (note.get(name)) value = note.get(name) + this.joiner + value;
            note.set(name, value);
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