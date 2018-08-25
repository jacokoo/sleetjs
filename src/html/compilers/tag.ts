import { CompilerFactory, Compiler, Context } from '../context'
import { NodeType, SleetNode, Tag } from '../../ast';

export class TagCompiler implements Compiler {
    private _tag: Tag

    constructor (node: Tag) {
        this._tag = node
    }

    compile (context: Context) {
        context.indent().push('')
    }
}

export class TagCompilerFactory implements CompilerFactory {
    type: NodeType.Tag

    create (node: SleetNode, stack: SleetNode[]): Compiler | undefined {
        return new TagCompiler(node as Tag)
    }
}
