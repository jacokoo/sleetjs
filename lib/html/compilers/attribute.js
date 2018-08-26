"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("../../ast");
class AttributeGroupCompiler {
    constructor(node, stack) {
        this.group = node;
        this.stack = stack;
    }
    static create(node, stack) {
        return new AttributeGroupCompiler(node, stack);
    }
    compile(context) {
        const stack = this.stack.concat(this.group);
        this.group.attributes.forEach((it, idx) => {
            const sub = context.compile(it, stack);
            if (!sub)
                return;
            if (idx)
                context.push(' ');
            sub.mergeUp();
        });
    }
}
AttributeGroupCompiler.type = ast_1.NodeType.AttributeGroup;
exports.AttributeGroupCompiler = AttributeGroupCompiler;
class AttributeCompiler {
    constructor(node, stack) {
        this.node = node;
        this.stack = stack.concat(node);
    }
    static create(node, stack) {
        return new AttributeCompiler(node, stack);
    }
    compile(context) {
        let k = this.key(context);
        const v = this.value(context);
        if (!k)
            k = v;
        context.push(k).push('="').push(v).push('"');
    }
    key(context) {
        let result = '';
        if (this.node.namespace && this.node.name)
            result += this.node.namespace + ':';
        if (this.node.name)
            result += this.node.name;
        return result;
    }
    value(context) {
        const vs = this.node.values.map(it => {
            const sub = context.compile(it, this.stack);
            return sub ? sub.getOutput() : '';
        });
        return this.node.name === 'class' ? vs.join(' ') : vs.join('');
    }
}
AttributeCompiler.type = ast_1.NodeType.Attribute;
exports.AttributeCompiler = AttributeCompiler;
