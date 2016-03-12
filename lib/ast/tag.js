"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tag = function () {
    function Tag(indent, name) {
        _classCallCheck(this, Tag);

        this.indent = indent;
        this.name = name;
    }

    _createClass(Tag, [{
        key: "attributeGroups",
        value: function attributeGroups(group) {
            return group == null ? this._attributeGroups : this._attributeGroups.push(group);
        }
    }, {
        key: "children",
        value: function children(child) {
            return child == null ? this._children : this._children.push(child);
        }
    }, {
        key: "namespace",
        get: function get() {
            return this._namespace;
        },
        set: function set(ns) {
            this._namespace = ns;
        }
    }, {
        key: "hash",
        get: function get() {
            return this._hash;
        },
        set: function set(h) {
            this._hash = h;
        }
    }, {
        key: "dots",
        get: function get() {
            return this._dots;
        },
        set: function set(d) {
            this._dots = d;
        }
    }]);

    return Tag;
}();