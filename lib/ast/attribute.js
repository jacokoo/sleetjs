'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Attribute = exports.Attribute = function () {
    function Attribute(name, value, namespace) {
        _classCallCheck(this, Attribute);

        this._name = name;
        this._value = value;
        this._namespace = namespace || '';
    }

    _createClass(Attribute, [{
        key: 'name',
        get: function get() {
            return this._name;
        }
    }, {
        key: 'value',
        get: function get() {
            return this._value;
        }
    }, {
        key: 'namespace',
        get: function get() {
            return this._namespace;
        }
    }]);

    return Attribute;
}();

var AttributeContainer = function () {
    function AttributeContainer(attributes) {
        _classCallCheck(this, AttributeContainer);

        this._attributes = attributes;
    }

    _createClass(AttributeContainer, [{
        key: 'attributes',
        get: function get() {
            return this._attributes;
        }
    }]);

    return AttributeContainer;
}();

Attribute.Settings = function (_AttributeContainer) {
    _inherits(Settings, _AttributeContainer);

    function Settings(name, attributes) {
        _classCallCheck(this, Settings);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Settings).call(this, attributes));

        _this._name = name;
        return _this;
    }

    _createClass(Settings, [{
        key: 'name',
        get: function get() {
            return this._name;
        }
    }]);

    return Settings;
}(AttributeContainer);

Attribute.Helper = function (_Attribute$Settings) {
    _inherits(Helper, _Attribute$Settings);

    function Helper(name, attributes) {
        _classCallCheck(this, Helper);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Helper).call(this, name, attributes));

        _this2._type = 'helper';
        return _this2;
    }

    _createClass(Helper, [{
        key: 'type',
        get: function get() {
            return this._type;
        }
    }]);

    return Helper;
}(Attribute.Settings);

Attribute.Group = function (_AttributeContainer2) {
    _inherits(Group, _AttributeContainer2);

    function Group(attributes, settings) {
        _classCallCheck(this, Group);

        var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(Group).call(this, attributes));

        _this3._settings = settings;
        return _this3;
    }

    _createClass(Group, [{
        key: 'settings',
        get: function get() {
            return this._settings;
        }
    }]);

    return Group;
}(AttributeContainer);