"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const tag_1 = require("./tag");
const ast_1 = require("../../ast");
const ast = require("../../ast");
const parser_1 = require("../../parser");
class IncludeCompiler extends tag_1.TagCompiler {
    static create(node, stack) {
        if (node.name === '@include')
            return new IncludeCompiler(node, stack);
    }
    compile(context) {
        let dir = context.options.sourceFile || path.resolve('.');
        if (fs.statSync(dir).isFile())
            dir = path.dirname(dir);
        const file = path.resolve(dir, this.getPath());
        const { nodes } = parser_1.parse(fs.readFileSync(file, 'utf-8'), { ast });
        nodes.forEach(it => {
            const sub = context.compile(it, this.stack, -1);
            sub && sub.mergeUp();
        });
    }
    getPath() {
        if (this.tag.attributeGroups.length) {
            const v = this.tag.attributeGroups[0].attributes[0].values[0];
            if (v) {
                if (v instanceof ast_1.StringValue)
                    return v.value;
                if (v instanceof ast_1.IdentifierValue)
                    return v.value;
            }
        }
        throw new SyntaxError(`no file specified, line: ${this.tag.location.start.line} column: ${this.tag.location.start.column}`);
    }
}
exports.IncludeCompiler = IncludeCompiler;
