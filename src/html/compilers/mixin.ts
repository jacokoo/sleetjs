import { TagCompiler } from './tag'
import { SleetNode, Tag } from '../../ast'
import { Compiler, Context } from '../../context'

interface Mixin {
    nodes: SleetNode[]
    replacement: {[name: string]: any}
}

export class MixinDefineCompiler extends TagCompiler {
    static create (node: SleetNode, stack: SleetNode[]): Compiler | undefined {
        if ((node as Tag).name === '@mixin') return new MixinDefineCompiler(node as Tag, stack)
    }

    compile (context: Context) {
        if (!this.tag.hash) {
            throw new Error('Hash property is required for mixin definition. eg. @mixin#name')
        }

        if (this.tag.indent !== 0) {
            throw new Error('Mixin definition must be placed in top level(the indent of it must be 0)')
        }

        if (!context.note.mixin) context.note.mixin = {}
        if (context.note.mixin[this.tag.hash]) {
            throw new Error(`Mixin definition #${this.tag.hash} have already defined`)
        }

        context.note.mixin[this.tag.hash] = {
            nodes: this.tag.children,
            replacement: this.replacement(context)
        } as Mixin
    }

    replacement (context: Context): {[name: string]: any} {
        if (!this.tag.attributeGroups.length) return {}
        const attrs = this.tag.attributeGroups[0].attributes
        return attrs.reduce((acc, it) => {
            const v = it.values[0]
            if (!v) return acc

            const stack = this.stack.concat(this.tag.attributeGroups[0], it)
            const sub = context.compile(v, stack)
            if (!sub) return acc
            const vv = sub.getOutput()

            it.name ? acc[it.name] = vv : acc[vv] = null
            return acc
        }, {} as {[name: string]: any})
    }
}

export class MixinReferenceCompiler extends MixinDefineCompiler {
    static create (node: SleetNode, stack: SleetNode[]): Compiler | undefined {
        if ((node as Tag).name === 'mixin') return new MixinReferenceCompiler(node as Tag, stack)
    }

    compile (context: Context) {
        if (!this.tag.hash) {
            throw new Error('Hash property is required for mixin reference. eg. mixin#name')
        }

        if (!context.note.mixin || !context.note.mixin[this.tag.hash]) {
            throw new Error(`Mixin #${this.tag.hash} is not defined`)
        }
        const def = context.note.mixin[this.tag.hash] as Mixin
        const ctx = context.sub()
        def.nodes.forEach(it => {
            const sub = ctx.compile(it, this.stack, -2)
            if (sub) sub.mergeUp()
        })

        const output = ctx.getOutput()
        const actual = Object.assign({}, def.replacement, this.replacement(context))
        const o = Object.keys(actual).reduce((acc, item) => {
            return acc.replace(new RegExp(`\\$${item}`, 'g'), actual[item])
        }, output)
        context.push(o)
    }

}
