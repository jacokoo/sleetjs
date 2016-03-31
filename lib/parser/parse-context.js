'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ParseContext = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tag = require('../ast/tag');

var _declaration = require('../ast/declaration');

var _attribute = require('../ast/attribute');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ParseContext = exports.ParseContext = function () {
    function ParseContext() {
        _classCallCheck(this, ParseContext);

        this._indentToken = null;
        this._indent = 0;
        this._parents = [];
        this._result = {};
        this._current = null;
    }

    _createClass(ParseContext, [{
        key: 'parent',
        value: function parent() {
            return this._parents[this._parents.length - 1];
        }
    }, {
        key: 'current',
        value: function current() {
            return this._current;
        }
    }, {
        key: 'createDeclare',
        value: function createDeclare(name) {
            return this._current = this._result.declare = new Declare(name);
        }
    }]);

    return ParseContext;
}();