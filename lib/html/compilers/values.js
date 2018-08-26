"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast_1 = require("../../ast");
class ValueCompiler {
    constructor(value) {
        this.value = value;
    }
    compile(context) {
        context.push(this.value.value);
    }
}
class StringValueCompiler extends ValueCompiler {
    static create(node, stack) {
        return new StringValueCompiler(node);
    }
}
StringValueCompiler.type = ast_1.NodeType.StringValue;
exports.StringValueCompiler = StringValueCompiler;
class BooleanValueCompiler extends ValueCompiler {
    static create(node, stack) {
        return new BooleanValueCompiler(node);
    }
}
BooleanValueCompiler.type = ast_1.NodeType.BooleanValue;
exports.BooleanValueCompiler = BooleanValueCompiler;
class NumberValueCompiler extends ValueCompiler {
    static create(node, stack) {
        return new NumberValueCompiler(node);
    }
}
NumberValueCompiler.type = ast_1.NodeType.NumberValue;
exports.NumberValueCompiler = NumberValueCompiler;
class IdentifierValueCompiler extends ValueCompiler {
    static create(node, stack) {
        return new IdentifierValueCompiler(node);
    }
}
IdentifierValueCompiler.type = ast_1.NodeType.IdentifierValue;
exports.IdentifierValueCompiler = IdentifierValueCompiler;
