import { parse } from './parser'
import { Context } from './context'
import { NodeType, SleetNode, Declaration, Tag } from './ast'

export * from './ast'
export { Context, parse }

export interface SleetOutput {
    code: string
    mapping?: string
    extension?: string
}

export interface Location {
    start: {offset: number, line: number, column: number}
    end: {offset: number, line: number, column: number}
}

export interface Compiler {
    compile (context: Context, ...others: SleetNode[]): void
}

export abstract class AbstractCompiler<T extends SleetNode> implements Compiler {
    protected node: T
    protected stack: SleetStack

    constructor(node: T, stack: SleetStack) {
        this.node = node
        this.stack = stack.concat(node)
    }

    abstract compile (context: Context, ...others: SleetNode[]): void
}

export interface CompilerFactory {
    type: NodeType
    new (...args: any[]): Compiler
    create (node: SleetNode, stack: SleetStack): Compiler | undefined
}

export interface CompileResult {
    nodes: Tag[]
    indent: string
    declaration?: Declaration
}

export interface SleetPlugin {
    prepare? (context: Context): void
    compile (input: CompileResult, options: SleetOptions, context: Context): SleetOutput
}

export interface SleetOptions {
    plugins?: {[name: string]: SleetPlugin}
    defaultPlugin?: string | SleetPlugin
    pluginOptions?: {[name: string]: any}
    sourceFile?: string
    newLineToken?: string
    ignoreSetting?: boolean
    compile? (input: CompileResult, options: SleetOptions): SleetOutput
}

interface StackItem {
    node: SleetNode
    note: {[name: string]: any}
}

export class SleetStack {
    private items: StackItem[]
    private _notes: {[name: string]: any}

    constructor (items?: StackItem[], notes: {[name: string]: any} = {}) {
        this.items = items || []
        this._notes = notes
    }

    last (type?: NodeType): StackItem | undefined {
        if (!type) return this.items[this.items.length - 1]
        for (let i = this.items.length - 1; i >= 0; i --) {
            if (this.items[i].node.type === type) return this.items[i]
        }
    }

    concat (item: SleetNode | SleetNode[]) {
        let its
        if (Array.isArray(item)) {
            its = this.items.concat(item.map(it => {
                return {node: it, note: {}}
            }))
        } else {
            its = this.items.concat({node: item, note: {}})
        }
        return new SleetStack(its, this._notes)
    }

    note (key: string): any {
        return this._notes[key]
    }
}

export function compile(input: string, options: SleetOptions): SleetOutput {
    const result = parse(input, options.ignoreSetting !== false)
    if (options.compile) {
        return options.compile(result, options)
    }

    let name: string | SleetPlugin = ''
    if (result.declaration) {
        name = result.declaration.name
    }

    if (!name && options.defaultPlugin) name = options.defaultPlugin
    if (name && typeof name === 'string') {
        if (name.slice(0, 6) === 'sleet-') name = name.slice(6)
        if (options.plugins && options.plugins[name]) name = options.plugins[name]
    }

    if (!name) name = 'html'
    if (name && typeof name === 'string') {
        const o = require(`sleet-${name}`)
        name = o.plugin
    }

    const context = new Context(options, 0, result.indent, options.newLineToken || '\n')
    const plugin = name as SleetPlugin
    if (plugin.prepare) plugin.prepare(context)
    return plugin.compile(result, options, context)
}
