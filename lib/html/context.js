"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Context {
    constructor(options, indent = -1, indentToken = '    ', newLineToken = '\n', parent, factories = {}) {
        this._children = [];
        this._result = [];
        this._options = options;
        this._indent = indent;
        this._indentToken = indentToken;
        this._newLineToken = newLineToken;
        this._parent = parent;
        this._factories = factories;
    }
    get options() {
        return this._options;
    }
    register(factory) {
        if (!this._factories[factory.type])
            this._factories[factory.type] = [];
        this._factories[factory.type].unshift(factory);
    }
    create(node, stack) {
        const factory = this._factories[node.type];
        if (!factory)
            return;
        let c = undefined;
        let idx = 0;
        while (!c && idx < factory.length) {
            c = factory[idx].create(node, stack);
            idx++;
        }
        return c;
    }
    indent(delta = 0) {
        let idt = '';
        for (let i = 0; i < this._indent + delta; i++) {
            idt += this._indentToken;
        }
        this._result.push(idt);
        return this;
    }
    push(text) {
        this._result.push(text);
        return this;
    }
    pop() {
        this._result.pop();
        return this;
    }
    eol() {
        this._result.push(this._newLineToken);
        return this;
    }
    sub(idt = 0) {
        const ctx = new Context(this._options, idt + this._indent + 1, this._indentToken, this._newLineToken, this, this._factories);
        this._children.push(ctx);
        return ctx;
    }
}
exports.Context = Context;
//# sourceMappingURL=context.js.map