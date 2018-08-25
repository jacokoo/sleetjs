import { SleetNode, NodeType } from '../ast';
import { SleetOptions } from '../sleet';
export interface Compiler {
    compile(context: Context): any;
}
export interface CompilerFactory {
    type: NodeType;
    create(node: SleetNode, stack: SleetNode[]): Compiler | undefined;
}
export declare class Context {
    private _options;
    private _indent;
    private _indentToken;
    private _newLineToken;
    private _parent?;
    private _children;
    private _result;
    private _factories;
    constructor(options: SleetOptions, indent?: number, indentToken?: string, newLineToken?: string, parent?: Context, factories?: {
        [type: number]: CompilerFactory[];
    });
    readonly options: SleetOptions;
    register(factory: CompilerFactory): void;
    create(node: SleetNode, stack: SleetNode[]): Compiler | undefined;
    indent(delta?: number): this;
    push(text: any): this;
    pop(): this;
    eol(): this;
    sub(idt?: number): Context;
}
