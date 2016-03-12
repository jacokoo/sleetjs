"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Attribute = exports.Attribute = {
    Pairs: function () {
        function Pairs(pairs) {
            var _this = this;

            _classCallCheck(this, Pairs);

            this.attributes = {};
            pairs.map(function (item) {
                return _this.attributes[item.key] = item.value;
            });
        }

        _createClass(Pairs, [{
            key: "attr",
            value: function attr(name) {
                return this.attributes[name];
            }
        }, {
            key: "values",
            value: function values(name, type) {
                if (type == null) {
                    return this.attr(name).map(function (item) {
                        return item.value;
                    });
                }
                return this.attr(name).filter(function (item) {
                    return item.type === type;
                }).map(function (item) {
                    return item.value;
                });
            }
        }, {
            key: "value",
            value: function value(name, type) {
                if (type == null) {
                    return this.attr(name).value;
                }
                return this.attr(name).find(function (item) {
                    return item.type === type;
                }).value;
            }
        }]);

        return Pairs;
    }(),

    Settings: function Settings(name, attributes) {
        _classCallCheck(this, Settings);

        this.name = name;
        this.attributes = attributes;
    },

    Group: function Group(attributes, settings) {
        _classCallCheck(this, Group);

        this.attributes = attributes;
        this.settings = settings;
    }
};