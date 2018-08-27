import { SleetNode, NodeType } from './ast';
import { SleetOptions } from './sleet';
export interface Compiler {
    compile(context: Context): void;
}
export interface CompilerFactory {
    type: NodeType;
    new (...args: any[]): Compiler;
    create(node: SleetNode, stack: SleetNode[]): Compiler | undefined;
}
export declare class Context {
    private _options;
    private _note;
    private _indent;
    private _haveIndent;
    private _indentToken;
    private _newLineToken;
    private _parent?;
    private _result;
    private _factories;
    constructor(options: SleetOptions, indent: number | undefined, indentToken: string, newLineToken?: string, parent?: Context, factories?: {
        [type: number]: CompilerFactory[];
    }, note?: object);
    readonly options: SleetOptions;
    readonly note: {
        [name: string]: any;
    };
    readonly haveIndent: boolean;
    register(...factory: CompilerFactory[]): void;
    remove(factory: CompilerFactory): void;
    replace(from: CompilerFactory, to: CompilerFactory): void;
    create(node: SleetNode, stack: SleetNode[]): Compiler | undefined;
    _setHaveIndent(have: boolean): void;
    indent(delta?: number): this;
    mergeUp(): void;
    push(text: string): this;
    pop(): this;
    eol(): this;
    sub(idt?: number): Context;
    haveContent(): boolean;
    getOutput(): string;
    compile(node: SleetNode, stack: SleetNode[], indent?: number): Context | null;
}
