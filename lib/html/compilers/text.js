"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("../../ast");
const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
};
const escapeHtml = (string) => string.replace(/[&<>"'`=\/]/g, s => map[s]);
class TextCompiler {
    constructor(node) {
        this.tag = node;
    }
    static create(node, stack) {
        if (node.name === '|')
            return new TextCompiler(node);
    }
    compile(context) {
        if (!this.tag.text.length)
            return;
        const escape = this.escape();
        const lines = this.tag.text.filter(it => !!it.length);
        if (!this.inline())
            context.eol();
        lines.forEach(line => {
            if (!line.some(it => !!it.toHTMLString().length)) {
                context.eol();
                return;
            }
            if (!this.inline())
                context.indent();
            line.forEach(it => {
                const text = it.toHTMLString();
                context.push(escape ? escapeHtml(text) : text);
            });
            context.eol();
        });
        context.pop();
    }
    escape() {
        return this.tag.namespace === 'escape';
    }
    inline() {
        return this.tag.namespace === 'inline';
    }
}
TextCompiler.type = ast_1.NodeType.Tag;
exports.TextCompiler = TextCompiler;
