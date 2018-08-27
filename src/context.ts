import { SleetNode } from './ast'
import { SleetOptions, CompilerFactory, Compiler, SleetStack } from './sleet'

export class Context {
    private _options: SleetOptions
    private _note: {[name: string]: any}

    private _indent: number
    private _haveIndent: boolean
    private _indentToken: string
    private _newLineToken: string

    private _parent?: Context
    private _result: string[] = []
    private _factories: {[type: number]: CompilerFactory[]}

    constructor (
        options: SleetOptions, indent: number = -1, indentToken: string,
        newLineToken = '\n', parent?: Context, factories: {[type: number]: CompilerFactory[]} = {}, note: object = {}
    ) {
        this._options = options
        this._indent = indent
        this._indentToken = indentToken || '    '
        this._newLineToken = newLineToken

        this._parent = parent
        this._factories = factories
        this._note = note
    }

    get options (): SleetOptions {
        return this._options
    }

    get note (): {[name: string]: any} {
        return this._note
    }

    get haveIndent () {
        return this._haveIndent
    }

    register (...factory: CompilerFactory[]) {
        factory.forEach(it => {
            if (!this._factories[it.type]) this._factories[it.type] = []
            this._factories[it.type].unshift(it)
        })
    }

    remove (factory: CompilerFactory) {
        if (!this._factories[factory.type]) return
        this._factories[factory.type] = this._factories[factory.type].filter(it => it !== factory)
    }

    replace (from: CompilerFactory, to: CompilerFactory) {
        if (from.type !== to.type || !this._factories[from.type]) return
        const idx = this._factories[from.type].indexOf(from)
        if (idx === -1) return
        this._factories[from.type][idx] = to
    }

    create (node: SleetNode, stack: SleetStack): Compiler | undefined {
        const factory = this._factories[node.type]
        if (!factory) return
        let c: Compiler | undefined
        let idx = 0

        while (!c && idx < factory.length) {
            c = factory[idx].create(node, stack)
            idx ++
        }

        return c
    }

    _setHaveIndent (have: boolean) {
        if (!this._parent) return
        this._parent._haveIndent = have
        this._parent._setHaveIndent(have)
    }

    indent (delta = 0) {
        if (!this.haveContent()) return this
        let idt = ''

        for (let i = 0; i < this._indent + delta; i ++) {
            idt += this._indentToken
        }
        this._result.push(idt)
        this._setHaveIndent(true)
        return this
    }

    mergeUp () {
        if (this._parent) this._parent._result = this._parent._result.concat(this._result)
    }

    push (text: string) {
        this._result.push(text)
        return this
    }

    pop () {
        this._result.pop()
        return this
    }

    eol () {
        if (!this.haveContent()) return this
        this._result.push(this._newLineToken)
        return this
    }

    sub (idt = 0) {
        return new Context(
            this._options, idt + this._indent + 1, this._indentToken,
            this._newLineToken, this, this._factories, this._note
        )
    }

    haveContent (): boolean {
        return (this._parent && this._parent.haveContent()) || this._result.length !== 0
    }

    getOutput () {
        if (!this._parent) {
            if (this._result.slice(-1)[0] !== this._newLineToken) this.eol()
        }
        return this._result.join('')
    }

    compile (node: SleetNode, stack: SleetStack, indent = 0) {
        const compiler = this.create(node, stack)
        if (!compiler) return null

        const sub = this.sub(indent)
        compiler.compile(sub)
        return sub
    }
}
