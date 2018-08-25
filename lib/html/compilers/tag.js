"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TagCompiler {
    constructor(node) {
        this._tag = node;
    }
    compile(context) {
        context.indent().push('');
    }
}
exports.TagCompiler = TagCompiler;
class TagCompilerFactory {
    create(node, stack) {
        return new TagCompiler(node);
    }
}
exports.TagCompilerFactory = TagCompilerFactory;
//# sourceMappingURL=tag.js.map