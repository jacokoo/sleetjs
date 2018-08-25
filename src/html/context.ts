import { SleetNode, NodeType, CompileResult } from '../ast'
import { SleetOptions } from '../sleet'

export interface Compiler {
    compile (context: Context)
}

export interface CompilerFactory {
    type: NodeType
    create (node: SleetNode, stack: SleetNode[]): Compiler | undefined
}

export class Context {
    private _options: SleetOptions

    private _indent: number
    private _indentToken: string
    private _newLineToken: string

    private _parent?: Context
    private _children: Context[] = []

    private _result: string[] = []

    private _factories: {[type: number]: CompilerFactory[]}

    constructor (
        options: SleetOptions, indent: number = -1, indentToken = '    ',
        newLineToken = '\n', parent?: Context, factories: {[type: number]: CompilerFactory[]} = {}
    ) {
        this._options = options
        this._indent = indent
        this._indentToken = indentToken
        this._newLineToken = newLineToken

        this._parent = parent
        this._factories = factories
    }

    get options () {
        return this._options
    }

    register (factory: CompilerFactory) {
        if (!this._factories[factory.type]) this._factories[factory.type] = []
        this._factories[factory.type].unshift(factory)
    }

    create (node: SleetNode, stack: SleetNode[]): Compiler | undefined {
        const factory = this._factories[node.type]
        if (!factory) return
        let c: Compiler | undefined = undefined
        let idx = 0

        while (!c && idx < factory.length) {
            c = factory[idx].create(node, stack)
            idx ++
        }

        return c
    }

    indent (delta = 0) {
        let idt = ''

        for (let i = 0; i < this._indent + delta; i ++) {
            idt += this._indentToken;
        }
        this._result.push(idt);
        return this;
    }

    push (text) {
        this._result.push(text);
        return this;
    }

    pop () {
        this._result.pop();
        return this;
    }

    eol () {
        this._result.push(this._newLineToken);
        return this;
    }

    sub (idt = 0) {
        const ctx = new Context(this._options, idt + this._indent + 1, this._indentToken, this._newLineToken, this, this._factories)
        this._children.push(ctx)
        return ctx;
    }
}
