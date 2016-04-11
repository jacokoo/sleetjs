import { Tag } from './ast/tag';
import { TagCompiler } from './compiler/tag';
import { GroupCompiler } from './compiler/group';
import { AttributeCompiler } from './compiler/attribute';
import { ValueCompiler } from './compiler/value';
import { SettingCompiler } from './compiler/setting';

import { TextTagCompiler } from './compiler/text-tag';
import { CommentCompiler } from './compiler/comment';
import { EmptyTagCompiler } from './compiler/empty-tag';
import { IeifCompiler } from './compiler/ieif';
import { DoctypeCompiler } from './compiler/doctype';
import { EchoCompiler } from './compiler/echo';
import { MixinDefinitionCompiler } from './compiler/mixin-def';
import { MixinReferenceCompiler } from './compiler/mixin-ref';
import { IncludeCompiler } from './compiler/include';

const compilers = {
    tag: new TagCompiler(),
    group: new GroupCompiler(),
    attribute: new AttributeCompiler(),
    value: new ValueCompiler(),
    setting: new SettingCompiler(),

    'attribute.class': new AttributeCompiler(' '),
    'tag.|': new TextTagCompiler(),
    'tag.#': new CommentCompiler(),
    'tag.br': new EmptyTagCompiler(),
    'tag.ieif': new IeifCompiler(),
    'tag.@ieif': new IeifCompiler(true),
    'tag.doctype': new DoctypeCompiler(),
    'tag.echo': new EchoCompiler(),
    'tag.@mixin': new MixinDefinitionCompiler(),
    'tag.mixin': new MixinReferenceCompiler(),
    'tag.@include': new IncludeCompiler()
};

const emptyTags = [
    'area', 'base', 'br', 'col', 'command',
    'embed', 'hr', 'img', 'input', 'keygen',
    'link', 'meta', 'param', 'source', 'track', 'wbr'
];

emptyTags.forEach(item => compilers[`tag.${item}`] = new EmptyTagCompiler());

const booleanAttribute = [
    'disabled', 'checked', 'readonly', 'required', 'selected', 'sortable'
];

booleanAttribute.forEach(item => compilers[`attribute.${item}`] = new AttributeCompiler('', true));

const getCompiler = function(others, item) {
    let name = item.type;
    let compiler = compilers[`${name}`];

    if (item.major) {
        name = `${name}.${item.major}`;
        if (others[name]) compiler = others[name];
        else if (compilers[name]) compiler = compilers[name];
    }

    if (item.minor) {
        name = `${name}.${item.minor}`;
        if (others[name]) compiler = others[name];
        else if (compilers[name]) compiler = compilers[name];
    }

    if (item.name) {
        name = `${name}.${item.name}`;
        if (others[name]) compiler = others[name];
        else if (compilers[name]) compiler = compilers[name];
    }

    if (item.namespace) {
        name = `${name}.${item.namespace}`;
        if (others[name]) compiler = others[name];
        else if (compilers[name]) compiler = compilers[name];
    }

    return compiler;
};

class Note {
    constructor (context, name) {
        this._note = {};
        this._noteNames = [];
        this._context = context;
        this._name = name;
    }

    get (name) { return this._note[name]; }

    set (name, value) {
        if (!this._note.hasOwnProperty(name)) this._noteNames.push(name);
        this._note[name] = value;
    }

    each (fn) { this._noteNames.forEach(key => fn(key, this._note[key])); }

    clear () { delete this._context._notes[this._name]; }
}

export class Context {
    constructor (options, tag, indentToken = '    ', indent = -1, parent) {
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

    get root () {
        let r = this;
        while (r.parent) r = r.parent;
        return r;
    }
    get options () { return this._options; }
    get parent () { return this._parent; }
    get compiler () { return this._compiler; }
    set compiler (compiler) { this._compiler = compiler; }

    sub (tag, idt = 0) {
        if (!tag instanceof Tag) {
            throw new Error('Tag is required to create a sub context');
        }

        const ctx = new Context(this._options, tag, this._indentToken, idt + this._indent + 1, this);
        this._children.push(ctx);

        ctx.compiler = this.getCompiler(tag);
        ctx.compiler.walk(ctx, tag);

        return ctx;
    }

    registerCompiler (name, compiler) { this.root._compilers[name] = compiler; }
    getCompiler (item) { return getCompiler(this.root._compilers, item); }

    getNote (name) {
        if (!this._notes[name]) this._notes[name] = new Note(this, name);
        return this._notes[name];
    }

    push (text) {
        this._result.push(text);
        return this;
    }

    pop () {
        this._result.pop();
        return this;
    }

    eol () {
        this._result.push(this._newlineToken);
        return this;
    }

    last (length) {
        return this._result.slice(-length);
    }

    indent (delta = 0) {
        let i = 0;
        let idt = '';

        for (; i < this._indent + delta; i ++) {
            idt += this._indentToken;
        }
        this._result.push(idt);

        if (this.parent) this.parent.containsIndent = true;
        return this;
    }

    get containsIndent () { return this._containsIndent; }
    set containsIndent (ci) { this._containsIndent = ci; }

    mergeUp () {
        if (this._parent) this._parent._result = this._parent._result.concat(this._result);
    }

    doCompile (tags) {
        if (!this._parent && tags) {
            tags.forEach(item => this.sub(item));
        }
        if (this._compiler) {
            this._compiler.compile(this, this._tag);
            this.mergeUp();
        } else {
            this.compileChildren();
        }
    }

    compileChildren () {
        this._children.forEach(item => item.doCompile());
    }

    getOutput (noJoin) {
        if (this._result[0] === this._newlineToken) this._result.shift();
        if (!this._parent && this._result.slice(-1)[0] !== this._newlineToken) this.eol();
        return noJoin ? this._result : this._result.join('');
    }

}
