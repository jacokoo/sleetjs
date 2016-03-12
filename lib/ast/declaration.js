"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Declaration = exports.Declaration = function () {
    function Declaration(name, ext, pairs) {
        var _this = this;

        _classCallCheck(this, Declaration);

        this._name = name;
        this._options = {};
        this._extension = ext;

        pairs.map(function (item) {
            return _this._options[item.key] = item.value;
        });
    }

    _createClass(Declaration, [{
        key: "option",
        value: function option(key) {
            return this._options[key];
        }
    }, {
        key: "name",
        get: function get() {
            return this._name;
        }
    }, {
        key: "extension",
        get: function get() {
            return this._extension;
        }
    }]);

    return Declaration;
}();