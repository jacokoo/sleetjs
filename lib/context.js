'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Context = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tag = require('./ast/tag');

var _tag2 = require('./compiler/tag');

var _group = require('./compiler/group');

var _attribute = require('./compiler/attribute');

var _value = require('./compiler/value');

var _setting = require('./compiler/setting');

var _textTag = require('./compiler/text-tag');

var _comment = require('./compiler/comment');

var _emptyTag = require('./compiler/empty-tag');

var _ieif = require('./compiler/ieif');

var _doctype = require('./compiler/doctype');

var _echo = require('./compiler/echo');

var _mixinDef = require('./compiler/mixin-def');

var _mixinRef = require('./compiler/mixin-ref');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var compilers = {
    tag: new _tag2.TagCompiler(),
    group: new _group.GroupCompiler(),
    attribute: new _attribute.AttributeCompiler(),
    'attribute-no-name': new _attribute.AttributeCompiler(),
    value: new _value.ValueCompiler(),
    setting: new _setting.SettingCompiler(),

    'attribute.class': new _attribute.AttributeCompiler(' '),
    'tag.|': new _textTag.TextTagCompiler(),
    'tag.#': new _comment.CommentCompiler(),
    'tag.br': new _emptyTag.EmptyTagCompiler(),
    'tag.ieif': new _ieif.IeifCompiler(),
    'tag.@ieif': new _ieif.IeifCompiler(true),
    'tag.doctype': new _doctype.DoctypeCompiler(),
    'tag.echo': new _echo.EchoCompiler(),
    'tag.@mixin': new _mixinDef.MixinDefinitionCompiler(),
    'tag.mixin': new _mixinRef.MixinReferenceCompiler()
};
var _getCompiler = function _getCompiler(item) {
    var name = item.type;
    var compiler = compilers['' + name];

    if (item.minor) {
        name = name + '.' + item.minor;
        if (compilers[name]) compiler = compilers[name];
    }

    if (item.name) {
        name = name + '.' + item.name;
        if (compilers[name]) compiler = compilers[name];
    }

    if (item.namespace) {
        name = name + '.' + item.namespace;
        if (compilers[name]) compiler = compilers[name];
    }

    return compiler;
};

var Context = exports.Context = function () {
    function Context(options, tag) {
        var indentToken = arguments.length <= 2 || arguments[2] === undefined ? '    ' : arguments[2];

        var _this = this;

        var indent = arguments.length <= 3 || arguments[3] === undefined ? -1 : arguments[3];
        var parent = arguments[4];

        _classCallCheck(this, Context);

        this._options = options;
        this._tag = tag;
        this._parent = parent;
        this._indentToken = indentToken;
        this._newlineToken = options.newlineToken || '\n';
        this._indent = indent;
        this._children = [];
        this._note = {};
        this._result = [];

        if (!parent) {
            tag.forEach(function (item) {
                return _this.sub(item);
            });
        }
    }

    _createClass(Context, [{
        key: 'sub',
        value: function sub(tag) {
            var idt = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

            if (!tag instanceof _tag.Tag) {
                throw new Error('Tag is required to create a sub context');
            }

            var ctx = new Context(this._options, tag, this._indentToken, idt + this._indent + 1, this);
            this._children.push(ctx);

            ctx.compiler = _getCompiler(tag);
            ctx.compiler.walk(ctx, tag);

            return ctx;
        }
    }, {
        key: 'registerCompiler',
        value: function registerCompiler(name, compiler) {
            compilers[name] = compiler;
        }
    }, {
        key: 'getCompiler',
        value: function getCompiler(item) {
            return _getCompiler(item);
        }
    }, {
        key: 'getNote',
        value: function getNote(name) {
            return this._note[name];
        }
    }, {
        key: 'setNote',
        value: function setNote(name, value) {
            this._note[name] = value;
        }
    }, {
        key: 'eachNote',
        value: function eachNote(fn) {
            var _this2 = this;

            Object.keys(this._note).forEach(function (key) {
                return fn(key, _this2._note[key]);
            });
        }
    }, {
        key: 'clearNote',
        value: function clearNote() {
            this._note = {};
        }
    }, {
        key: 'push',
        value: function push(text) {
            this._result.push(text);
            return this;
        }
    }, {
        key: 'pop',
        value: function pop() {
            this._result.pop();
            return this;
        }
    }, {
        key: 'eol',
        value: function eol() {
            this._result.push(this._newlineToken);
            return this;
        }
    }, {
        key: 'last',
        value: function last(length) {
            return this._result.slice(-length);
        }
    }, {
        key: 'indent',
        value: function indent() {
            var delta = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

            var i = 0;
            var idt = '';

            for (; i < this._indent + delta; i++) {
                idt += this._indentToken;
            }
            this._result.push(idt);

            if (this.parent) this.parent.containsIndent = true;
            return this;
        }
    }, {
        key: 'mergeUp',
        value: function mergeUp() {
            if (this._parent) this._parent._result = this._parent._result.concat(this._result);
        }
    }, {
        key: 'doCompile',
        value: function doCompile() {
            if (this._compiler) {
                this._compiler.compile(this, this._tag);
                this.mergeUp();
            } else {
                this.compileChildren();
            }
        }
    }, {
        key: 'compileChildren',
        value: function compileChildren() {
            this._children.forEach(function (item) {
                return item.doCompile();
            });
        }
    }, {
        key: 'getOutput',
        value: function getOutput(noJoin) {
            if (this._result[0] === '\n') this._result.shift();
            return noJoin ? this._result : this._result.join('');
        }
    }, {
        key: 'root',
        get: function get() {
            var r = this;
            while (r.parent) {
                r = r.parent;
            }return r;
        }
    }, {
        key: 'options',
        get: function get() {
            return this._options;
        }
    }, {
        key: 'parent',
        get: function get() {
            return this._parent;
        }
    }, {
        key: 'compiler',
        get: function get() {
            return this._compiler;
        },
        set: function set(compiler) {
            this._compiler = compiler;
        }
    }, {
        key: 'containsIndent',
        get: function get() {
            return this._containsIndent;
        },
        set: function set(ci) {
            this._containsIndent = ci;
        }
    }]);

    return Context;
}();