"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tag_1 = require("./tag");
const ast_1 = require("../../ast");
class CommentCompiler extends tag_1.TagCompiler {
    static create(node, stack) {
        if (node.name === '#')
            return new CommentCompiler(node, stack);
    }
    tagOpen(context) {
        context.eol().indent().push('<!--');
        if (this.inline())
            context.push(' ');
    }
    tagClose(context) {
        if (context.haveIndent)
            context.eol().indent();
        if (this.inline())
            context.push(' ');
        context.push('-->');
    }
    inline() {
        const node = this.tag.children[0];
        return node && node.namespace === 'inline';
    }
}
exports.CommentCompiler = CommentCompiler;
class DoctypeCompiler extends tag_1.TagCompiler {
    static create(node, stack) {
        if (node.name === 'doctype')
            return new DoctypeCompiler(node, stack);
    }
    compile(context) {
        context.eol().indent().push('<!DOCTYPE html>');
    }
}
exports.DoctypeCompiler = DoctypeCompiler;
class IeifCompiler extends tag_1.TagCompiler {
    static create(node, stack) {
        const tag = node;
        if (tag.name === 'ieif')
            return new IeifCompiler(tag, stack, false);
        if (tag.name === '@ieif')
            return new IeifCompiler(tag, stack, true);
    }
    constructor(node, stack, closeIt = false) {
        super(node, stack);
        this.closeIt = closeIt;
    }
    openStart(context) {
        context.eol().indent().push('<!--[if ');
    }
    openEnd(context) {
        context.push(this.closeIt ? ']><!-->' : ']>');
    }
    attributes(context) {
        if (this.tag.attributeGroups.length) {
            const attr = this.tag.attributeGroups[0].attributes[0];
            if (attr && attr.values[0] && attr.values[0] instanceof ast_1.StringValue) {
                const v = attr.values[0];
                context.push(v.value);
            }
        }
    }
    tagClose(context) {
        if (context.haveIndent)
            context.eol().indent();
        context.push(this.closeIt ? '<!--<![endif]-->' : '<![endif]-->');
    }
}
exports.IeifCompiler = IeifCompiler;
class EchoCompiler extends tag_1.TagCompiler {
    static create(node, stack) {
        if (node.name === 'echo')
            return new EchoCompiler(node, stack);
    }
    compile(context) {
        if (!this.tag.attributeGroups.length)
            return;
        context.eol().indent();
        this.tag.attributeGroups.forEach(it => it.attributes.forEach(attr => attr.values.forEach(v => {
            const stack = this.stack.concat(it, attr);
            const sub = context.compile(v, stack);
            if (sub)
                sub.mergeUp();
        })));
    }
}
exports.EchoCompiler = EchoCompiler;
