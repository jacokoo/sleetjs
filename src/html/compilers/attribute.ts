import { Compiler, Context } from '../context'
import { NodeType, SleetNode, AttributeGroup, Attribute } from '../../ast'

export class AttributeGroupCompiler implements Compiler {
    static type = NodeType.AttributeGroup
    static create (node: SleetNode, stack: SleetNode[]): Compiler | undefined {
        return new AttributeGroupCompiler(node as AttributeGroup, stack)
    }

    private group: AttributeGroup
    private stack: SleetNode[]

    constructor (node: AttributeGroup, stack: SleetNode[]) {
        this.group = node
        this.stack = stack
    }

    compile (context: Context) {
        const stack = this.stack.concat(this.group)
        this.group.attributes.forEach((it, idx) => {
            const sub = context.compile(it, stack)
            if (!sub) return
            if (idx) context.push(' ')
            sub.mergeUp()
        })
    }
}

export class AttributeCompiler implements Compiler {
    static type = NodeType.Attribute
    static create (node: SleetNode, stack: SleetNode[]): Compiler | undefined {
        return new AttributeCompiler(node as Attribute, stack)
    }

    private node: Attribute
    private stack: SleetNode[]

    constructor (node: Attribute, stack: SleetNode[]) {
        this.node = node
        this.stack = stack.concat(node)
    }

    compile (context: Context) {
        let k = this.key(context)
        const v = this.value(context)

        if (!k) k = v
        context.push(k).push('="').push(v).push('"')
    }

    key (context: Context) {
        let result = ''
        if (this.node.namespace && this.node.name) result += this.node.namespace + ':'
        if (this.node.name) result += this.node.name
        return result
    }

    value (context: Context) {
        const vs = this.node.values.map(it => {
            const sub = context.compile(it, this.stack)
            return sub ? sub.getOutput() : ''
        })
        return this.node.name === 'class' ? vs.join(' ') : vs.join('')
    }
}
