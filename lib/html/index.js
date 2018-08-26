"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("./context");
const tag_1 = require("./compilers/tag");
const text_1 = require("./compilers/text");
const other_tags_1 = require("./compilers/other-tags");
const values_1 = require("./compilers/values");
const attribute_1 = require("./compilers/attribute");
const include_1 = require("./compilers/include");
const mixin_1 = require("./compilers/mixin");
exports.default = {
    compile(input, options) {
        const { nodes, indent, declaration } = input;
        const context = new context_1.Context(options, 0, indent, '\n');
        context.register(tag_1.TagCompiler, text_1.TextCompiler, tag_1.EmptyTagCompiler, other_tags_1.CommentCompiler, other_tags_1.DoctypeCompiler, other_tags_1.IeifCompiler, other_tags_1.EchoCompiler, mixin_1.MixinDefineCompiler, mixin_1.MixinReferenceCompiler);
        context.register(values_1.StringValueCompiler, values_1.BooleanValueCompiler, values_1.NumberValueCompiler, values_1.IdentifierValueCompiler);
        context.register(attribute_1.AttributeGroupCompiler, attribute_1.AttributeCompiler);
        context.register(include_1.IncludeCompiler);
        nodes.forEach(it => {
            const sub = context.compile(it, [], -1);
            sub && sub.mergeUp();
        });
        return {
            code: context.getOutput(),
            extension: (declaration && declaration.extension) || 'html'
        };
    }
};
