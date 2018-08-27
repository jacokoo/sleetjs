import { CompileResult } from './ast';
import { Context } from './context';
export interface SleetOutput {
    code: string;
    mapping?: string;
    extension?: string;
}
export interface SleetPlugin {
    prepare(context: Context): void;
    compile(input: CompileResult, options: SleetOptions, context: Context): SleetOutput;
}
export interface SleetOptions {
    plugins?: {
        [name: string]: SleetPlugin;
    };
    defaultPlugin?: string | SleetPlugin;
    pluginOptions?: {
        [name: string]: any;
    };
    sourceFile?: string;
    newLineToken?: string;
    compile?(input: CompileResult, options: SleetOptions): SleetOutput;
}
export declare function compile(input: string, options: SleetOptions): SleetOutput;
