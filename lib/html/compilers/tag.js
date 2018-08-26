"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("../../ast");
class TagCompiler {
    constructor(node, stack) {
        this.tag = node;
        this.stack = stack.concat(node);
    }
    static create(node, stack) {
        return new TagCompiler(node, stack);
    }
    compile(context) {
        this.tagOpen(context);
        this.content(context);
        this.tagClose(context);
    }
    tagOpen(context) {
        this.openStart(context);
        this.attributes(context);
        this.openEnd(context);
    }
    openStart(context) {
        context.eol().indent().push('<');
        if (this.tag.namespace) {
            context.push(this.tag.namespace).push(':');
        }
        context.push(this.tag.name || 'div');
    }
    attributes(context) {
        const groups = this.mergeAttributeGroup(...[this.dotsAndHash()].concat(this.tag.attributeGroups));
        if (groups.length)
            context.push(' ');
        const sub = context.sub();
        groups.forEach(it => {
            const compiler = context.create(it, [this.tag]);
            compiler && compiler.compile(sub);
        });
        sub.mergeUp();
    }
    openEnd(context) {
        context.push('>');
    }
    content(context) {
        if (this.selfClosing())
            return;
        this.tag.children.forEach(it => {
            const sub = context.compile(it, this.stack);
            sub && sub.mergeUp();
        });
    }
    tagClose(context) {
        if (this.selfClosing())
            return;
        if (context.haveIndent)
            context.eol().indent();
        context.push('</');
        if (this.tag.namespace) {
            context.push(this.tag.namespace).push(':');
        }
        context.push(this.tag.name || 'div').push('>');
    }
    selfClosing() {
        return false;
    }
    dotsAndHash() {
        if (!this.tag.hash && !this.tag.dots.length)
            return null;
        const s = this.tag.location.start;
        let e;
        if (this.tag.attributeGroups.length) {
            e = this.tag.attributeGroups[0].location.start;
        }
        else {
            e = this.tag.location.end;
        }
        const location = {
            start: { offset: s.offset, line: s.line, column: s.column },
            end: { offset: e.offset, line: e.line, column: e.column }
        };
        const attrs = [];
        if (this.tag.hash) {
            const value = [new ast_1.StringValue(this.tag.hash, location)];
            attrs.push(new ast_1.Attribute(undefined, 'id', value, location));
        }
        if (this.tag.dots.length) {
            const value = this.tag.dots.map(it => new ast_1.StringValue(it, location));
            attrs.push(new ast_1.Attribute(undefined, 'class', value, location));
        }
        return new ast_1.AttributeGroup(attrs, undefined, location);
    }
    mergeAttributeGroup(...groups) {
        const gs = groups.filter(it => !!it);
        if (!gs.length)
            return [];
        return [gs.reduce((acc, item) => {
                acc.merge(item, true);
                return acc;
            })];
    }
}
TagCompiler.type = ast_1.NodeType.Tag;
exports.TagCompiler = TagCompiler;
const emptyTags = [
    'area', 'base', 'br', 'col', 'command',
    'embed', 'hr', 'img', 'input', 'keygen',
    'link', 'meta', 'param', 'source', 'track', 'wbr'
];
class EmptyTagCompiler extends TagCompiler {
    static create(node, stack) {
        const tag = node;
        if (!tag.name || emptyTags.indexOf(tag.name) === -1)
            return undefined;
        return new EmptyTagCompiler(tag, stack);
    }
    selfClosing() {
        return true;
    }
}
exports.EmptyTagCompiler = EmptyTagCompiler;
