import { CompileResult } from './ast';
export interface SleetOutput {
    code: string;
    map?: string;
    extension?: string;
}
export interface SleetPlugin {
    compile(input: CompileResult, options: SleetOptions): SleetOutput;
}
export interface SleetOptions {
    compile?(input: CompileResult, options: SleetOptions): SleetOutput;
    plugins?: {
        [name: string]: SleetPlugin;
    };
    defaultPlugin?: string | SleetPlugin;
    sourceFile?: string;
}
export declare function compile(input: string, options: SleetOptions): SleetOutput;
