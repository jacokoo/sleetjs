import { CompilerFactory, Compiler, Context } from '../context';
import { NodeType, SleetNode, Tag } from '../../ast';
export declare class TagCompiler implements Compiler {
    private _tag;
    constructor(node: Tag);
    compile(context: Context): void;
}
export declare class TagCompilerFactory implements CompilerFactory {
    type: NodeType.Tag;
    create(node: SleetNode, stack: SleetNode[]): Compiler | undefined;
}
