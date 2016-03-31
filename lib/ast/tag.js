'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tag = exports.Tag = function () {
    function Tag(indent, name, namespace, dots, hash, groups) {
        _classCallCheck(this, Tag);

        this._indent = indent;
        this._name = name;
        this._namespace = namespace || '';
        this._dots = dots || [];
        this._hash = hash || '';
        this._attributeGroups = groups;

        this._children = null;
        this._inlineChar = '';
        this._inlines = null;
    }

    _createClass(Tag, [{
        key: 'indent',
        get: function get() {
            return this._indent;
        }
    }, {
        key: 'name',
        get: function get() {
            return this._name;
        }
    }, {
        key: 'namespace',
        get: function get() {
            return this._namespace;
        }
    }, {
        key: 'hash',
        get: function get() {
            return this._hash;
        }
    }, {
        key: 'dots',
        get: function get() {
            return this._dots;
        }
    }, {
        key: 'attributeGroups',
        get: function get() {
            return this._attributeGroups;
        }
    }, {
        key: 'text',
        get: function get() {
            return this._text || [];
        },
        set: function set(t) {
            this._text = t || [];
        }
    }, {
        key: 'inlineChar',
        get: function get() {
            return this._inlineChar;
        },
        set: function set(inlineChar) {
            this._inlineChar = inlineChar;
        }
    }, {
        key: 'children',
        get: function get() {
            return this._children;
        },
        set: function set(children) {
            if (children.length === 1 && children[0].inlineChar) {
                var child = children[0];
                this._inlines = child._inlines ? children.concat(child._inlines) : children;
                child._inlines = null;
            } else {
                this._children = children;
            }
        }
    }, {
        key: 'parent',
        get: function get() {
            return this._parent;
        },
        set: function set(parent) {
            this._parent = parent;
        }
    }]);

    return Tag;
}();