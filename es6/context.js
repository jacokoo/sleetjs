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

const compilers = {
    tag: new TagCompiler(),
    group: new GroupCompiler(),
    attribute: new AttributeCompiler(),
    'attribute-no-name': new AttributeCompiler(),
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
};
const getCompiler = function(item) {
    let name = item.type;
    let compiler = compilers[`${name}`];

    if (item.minor) {
        name = `${name}.${item.minor}`;
        if (compilers[name]) compiler = compilers[name];
    }

    if (item.name) {
        name = `${name}.${item.name}`;
        if (compilers[name]) compiler = compilers[name];
    }

    if (item.namespace) {
        name = `${name}.${item.namespace}`;
        if (compilers[name]) compiler = compilers[name];
    }

    return compiler;
};

export class Context {
    constructor (options, tag, indentToken = '    ', indent = -1, parent) {
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
            tag.forEach(item => this.sub(item));
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

        ctx.compiler = getCompiler(tag);
        ctx.compiler.walk(ctx, tag);

        return ctx;
    }

    registerCompiler (name, compiler) { compilers[name] = compiler; }
    getCompiler (item) { return getCompiler(item); }

    getNote (name) { return this._note[name]; }
    setNote (name, value) { this._note[name] = value; }
    eachNote (fn) { Object.keys(this._note).forEach(key => fn(key, this._note[key])); }
    clearNote () { this._note = {}; }

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

    doCompile () {
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
        if (this._result[0] === '\n') this._result.shift();
        return noJoin ? this._result : this._result.join('');
    }

}
