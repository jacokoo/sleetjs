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
        key: 'type',
        get: function get() {
            return 'attribute';
        }
    }, {
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
    }, {
        key: 'minor',
        get: function get() {
            if (!this._name && this._value.length === 1 && this._value[0].minor === 'identifier') {
                return this._value[0].value;
            }
            return null;
        }
    }, {
        key: 'major',
        set: function set(m) {
            this._major = m;
            this._value.forEach(function (v) {
                return v.major = m;
            }); // eslint-disable-line no-param-reassign
        },
        get: function get() {
            return this._major;
        }
    }]);

    return Attribute;
}();

var AttributeContainer = function () {
    function AttributeContainer(attributes, major) {
        _classCallCheck(this, AttributeContainer);

        this._attributes = attributes;
        attributes.forEach(function (attr) {
            return attr.major = major;
        }); // eslint-disable-line no-param-reassign
    }

    _createClass(AttributeContainer, [{
        key: 'attributes',
        get: function get() {
            return this._attributes;
        }
    }]);

    return AttributeContainer;
}();

Attribute.Setting = function (_AttributeContainer) {
    _inherits(Settings, _AttributeContainer);

    function Settings(name, attributes) {
        _classCallCheck(this, Settings);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Settings).call(this, attributes, 'setting'));

        _this._name = name;
        return _this;
    }

    _createClass(Settings, [{
        key: 'type',
        get: function get() {
            return 'setting';
        }
    }, {
        key: 'name',
        get: function get() {
            return this._name;
        }
    }]);

    return Settings;
}(AttributeContainer);

function _merge(target, source) {
    source.forEach(function (item) {
        var attr = target.find(function (i) {
            return i.name && i.name === item.name;
        });
        attr ? attr._value = attr._value.concat(item._value) : target.push(item);
    });
    return target;
}

Attribute.Group = function (_AttributeContainer2) {
    _inherits(Group, _AttributeContainer2);

    function Group(attributes, setting) {
        _classCallCheck(this, Group);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Group).call(this, _merge([], attributes)));

        _this2._setting = setting;
        return _this2;
    }

    _createClass(Group, [{
        key: 'merge',
        value: function merge(group) {
            if (group.setting) return false;
            _merge(this._attributes, group._attributes);
            return true;
        }
    }, {
        key: 'type',
        get: function get() {
            return 'group';
        }
    }, {
        key: 'setting',
        get: function get() {
            return this._setting;
        }
    }]);

    return Group;
}(AttributeContainer);

var Value = function () {
    function Value() {
        _classCallCheck(this, Value);
    }

    _createClass(Value, [{
        key: 'type',
        get: function get() {
            return 'value';
        }
    }, {
        key: 'minor',
        get: function get() {
            return this._minor;
        }
    }, {
        key: 'value',
        get: function get() {
            return this._value;
        }
    }, {
        key: 'major',
        get: function get() {
            return this._major;
        },
        set: function set(m) {
            this._major = m;
        }
    }]);

    return Value;
}();

Attribute.Quoted = function (_Value) {
    _inherits(Quoted, _Value);

    function Quoted(value) {
        _classCallCheck(this, Quoted);

        var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(Quoted).call(this));

        _this3._value = value;
        _this3._minor = 'quoted';
        return _this3;
    }

    return Quoted;
}(Value);

Attribute.Number = function (_Value2) {
    _inherits(Number, _Value2);

    function Number(value) {
        _classCallCheck(this, Number);

        var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(Number).call(this));

        _this4._value = value;
        _this4._minor = 'number';
        return _this4;
    }

    return Number;
}(Value);

Attribute.Boolean = function (_Value3) {
    _inherits(Boolean, _Value3);

    function Boolean(value) {
        _classCallCheck(this, Boolean);

        var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(Boolean).call(this));

        _this5._value = value;
        _this5._minor = 'boolean';
        return _this5;
    }

    return Boolean;
}(Value);

Attribute.Identifier = function (_Value4) {
    _inherits(Identifier, _Value4);

    function Identifier(value) {
        _classCallCheck(this, Identifier);

        var _this6 = _possibleConstructorReturn(this, Object.getPrototypeOf(Identifier).call(this));

        _this6._value = value;
        _this6._minor = 'identifier';
        return _this6;
    }

    return Identifier;
}(Value);

Attribute.Helper = function (_Value5) {
    _inherits(Helper, _Value5);

    function Helper(name, attributes) {
        _classCallCheck(this, Helper);

        var _this7 = _possibleConstructorReturn(this, Object.getPrototypeOf(Helper).call(this));

        _this7._value = '';
        _this7._attributes = attributes;
        _this7._minor = 'helper';
        _this7._name = name;

        attributes.forEach(function (attr) {
            return attr.major = 'helper';
        }); // eslint-disable-line no-param-reassign
        return _this7;
    }

    _createClass(Helper, [{
        key: 'name',
        get: function get() {
            return this._name;
        }
    }, {
        key: 'attributes',
        get: function get() {
            return this._attributes;
        }
    }]);

    return Helper;
}(Value);