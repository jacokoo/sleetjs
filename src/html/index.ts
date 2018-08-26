import { SleetPlugin, SleetOptions, SleetOutput } from '../sleet'
import { CompileResult } from '../ast';
import { Context } from './context'
import { TagCompiler, EmptyTagCompiler } from './compilers/tag'
import { TextCompiler } from './compilers/text'
import { CommentCompiler, DoctypeCompiler, IeifCompiler, EchoCompiler } from './compilers/other-tags'
import { StringValueCompiler, BooleanValueCompiler, NumberValueCompiler, IdentifierValueCompiler } from './compilers/values'
import { AttributeGroupCompiler, AttributeCompiler } from './compilers/attribute'
import { IncludeCompiler } from './compilers/include'

export default {
    compile (input: CompileResult, options: SleetOptions): SleetOutput {
        const {nodes, indent, declaration} = input
        const context = new Context(options, 0, indent, '\n')
        context.register(
            TagCompiler, TextCompiler, EmptyTagCompiler, CommentCompiler,
            DoctypeCompiler, IeifCompiler, EchoCompiler
        )

        context.register(StringValueCompiler, BooleanValueCompiler, NumberValueCompiler, IdentifierValueCompiler)
        context.register(AttributeGroupCompiler, AttributeCompiler)
        context.register(IncludeCompiler)

        nodes.forEach(it => {
            const sub = context.compile(it, [], -1)
            sub && sub.mergeUp()
        })
        return {
            code: context.getOutput(),
            extension: (declaration && declaration.extension) || 'html'
        }
    }
} as SleetPlugin
