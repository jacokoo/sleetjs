import { CompileResult } from './ast'
import * as ast from './ast'
import * as parser from './parser'
import html from './html'

declare const require: (name: string) => SleetPlugin

export interface SleetOutput {
    code: string
    map?: string
    extension?: string
}

export interface SleetPlugin {
    compile (input: CompileResult, options: SleetOptions): SleetOutput
}

export interface SleetOptions {
    compile? (input: CompileResult, options: SleetOptions): SleetOutput
    plugins?: {[name: string]: SleetPlugin}
    defaultPlugin?: string | SleetPlugin
    sourceFile?: string
}

export function compile(input: string, options: SleetOptions): SleetOutput {
    const result = parser.parse(input, {ast}) as CompileResult
    if (options.compile) {
        return options.compile(result, options)
    }

    let name: string | SleetPlugin = ''
    if (result.declaration) {
        name = result.declaration.name
    }

    if (!name && options.defaultPlugin) name = options.defaultPlugin
    if (name && typeof name === 'string' && options.plugins && options.plugins[name]) {
        name = options.plugins[name]
    }

    if (name && name === 'html') name = html

    if (name && typeof name === 'string') {
        if (name.slice(0, 6) === 'sleet-') name = name.slice(6)
        name = require(name)
    }

    if (!name) name = html
    return (name as SleetPlugin).compile(result, options)
}
