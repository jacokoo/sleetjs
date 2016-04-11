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

var _include = require('./compiler/include');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var compilers = {
    tag: new _tag2.TagCompiler(),
    group: new _group.GroupCompiler(),
    attribute: new _attribute.AttributeCompiler(),
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
    'tag.mixin': new _mixinRef.MixinReferenceCompiler(),
    'tag.@include': new _include.IncludeCompiler()
};

var emptyTags = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

emptyTags.forEach(function (item) {
    return compilers['tag.' + item] = new _emptyTag.EmptyTagCompiler();
});

var booleanAttribute = ['disabled', 'checked', 'readonly', 'required', 'selected', 'sortable'];

booleanAttribute.forEach(function (item) {
    return compilers['attribute.' + item] = new _attribute.AttributeCompiler('', true);
});

var _getCompiler = function _getCompiler(others, item) {
    var name = item.type;
    var compiler = compilers['' + name];

    if (item.major) {
        name = name + '.' + item.major;
        if (others[name]) compiler = others[name];else if (compilers[name]) compiler = compilers[name];
    }

    if (item.minor) {
        name = name + '.' + item.minor;
        if (others[name]) compiler = others[name];else if (compilers[name]) compiler = compilers[name];
    }

    if (item.name) {
        name = name + '.' + item.name;
        if (others[name]) compiler = others[name];else if (compilers[name]) compiler = compilers[name];
    }

    if (item.namespace) {
        name = name + '.' + item.namespace;
        if (others[name]) compiler = others[name];else if (compilers[name]) compiler = compilers[name];
    }

    return compiler;
};

var Note = function () {
    function Note(context, name) {
        _classCallCheck(this, Note);

        this._note = {};
        this._noteNames = [];
        this._context = context;
        this._name = name;
    }

    _createClass(Note, [{
        key: 'get',
        value: function get(name) {
            return this._note[name];
        }
    }, {
        key: 'set',
        value: function set(name, value) {
            if (!this._note.hasOwnProperty(name)) this._noteNames.push(name);
            this._note[name] = value;
        }
    }, {
        key: 'each',
        value: function each(fn) {
            var _this = this;

            this._noteNames.forEach(function (key) {
                return fn(key, _this._note[key]);
            });
        }
    }, {
        key: 'clear',
        value: function clear() {
            delete this._context._notes[this._name];
        }
    }]);

    return Note;
}();

var Context = exports.Context = function () {
    function Context(options, tag) {
        var indentToken = arguments.length <= 2 || arguments[2] === undefined ? '    ' : arguments[2];
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
        this._notes = {};
        this._result = [];

        if (!parent) {
            this._compilers = {};
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

            ctx.compiler = this.getCompiler(tag);
            ctx.compiler.walk(ctx, tag);

            return ctx;
        }
    }, {
        key: 'registerCompiler',
        value: function registerCompiler(name, compiler) {
            this.root._compilers[name] = compiler;
        }
    }, {
        key: 'getCompiler',
        value: function getCompiler(item) {
            return _getCompiler(this.root._compilers, item);
        }
    }, {
        key: 'getNote',
        value: function getNote(name) {
            if (!this._notes[name]) this._notes[name] = new Note(this, name);
            return this._notes[name];
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
        value: function doCompile(tags) {
            var _this2 = this;

            if (!this._parent && tags) {
                tags.forEach(function (item) {
                    return _this2.sub(item);
                });
            }
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
            if (this._result[0] === this._newlineToken) this._result.shift();
            if (!this._parent && this._result.slice(-1)[0] !== this._newlineToken) this.eol();
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