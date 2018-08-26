import { NodeType, SleetNode, Tag, Attribute, StringValue, Location, AttributeGroup } from '../../ast';
import { Context, Compiler } from '../context'

export class TagCompiler implements Compiler {
    protected tag: Tag
    protected stack: SleetNode[]

    static type = NodeType.Tag
    static create (node: SleetNode, stack: SleetNode[]): Compiler | undefined {
        return new TagCompiler(node as Tag, stack)
    }

    constructor (node: Tag, stack: SleetNode[]) {
        this.tag = node
        this.stack = stack.concat(node)
    }

    compile (context: Context) {
        this.tagOpen(context)
        this.content(context)
        this.tagClose(context)
    }

    tagOpen (context: Context) {
        this.openStart(context)
        this.attributes(context)
        this.openEnd(context)
    }

    openStart (context: Context) {
        context.eol().indent().push('<')
        if (this.tag.namespace) {
            context.push(this.tag.namespace).push(':')
        }
        context.push(this.tag.name || 'div')
    }

    attributes (context: Context) {
        const groups = this.mergeAttributeGroup(...[this.dotsAndHash()].concat(this.tag.attributeGroups))
        if (groups.length) context.push(' ')
        const sub = context.sub()
        groups.forEach(it => {
            const compiler = context.create(it, [this.tag])
            compiler && compiler.compile(sub)
        })
        sub.mergeUp()
    }

    openEnd (context: Context) {
        context.push('>')
    }

    content (context: Context) {
        if (this.selfClosing()) return

        this.tag.children.forEach(it => {
            const sub = context.compile(it, this.stack)
            sub && sub.mergeUp()
        })
    }

    tagClose (context: Context) {
        if (this.selfClosing()) return
        if (context.haveIndent) context.eol().indent()
        context.push('</')
        if (this.tag.namespace) {
            context.push(this.tag.namespace).push(':')
        }
        context.push(this.tag.name || 'div').push('>')
    }

    selfClosing () {
        return false
    }

    dotsAndHash () {
        if (!this.tag.hash && !this.tag.dots.length) return null

        const s = this.tag.location.start
        let e
        if (this.tag.attributeGroups.length) {
            e = this.tag.attributeGroups[0].location.start
        } else {
            e = this.tag.location.end
        }
        const location = {
            start: {offset: s.offset, line: s.line, column: s.column},
            end: {offset: e.offset, line: e.line, column: e.column}
        } as Location

        const attrs = [] as Attribute[]
        if (this.tag.hash) {
            const value = [new StringValue(this.tag.hash, location)]
            attrs.push(new Attribute(undefined, 'id', value, location))
        }

        if (this.tag.dots.length) {
            const value = this.tag.dots.map(it => new StringValue(it, location))
            attrs.push(new Attribute(undefined, 'class', value, location))
        }

        return new AttributeGroup(attrs, undefined, location)
    }

    mergeAttributeGroup (...groups: (AttributeGroup| null)[]) {
        const gs = groups.filter(it => !!it) as AttributeGroup[]
        if (!gs.length) return []
        return [gs.reduce((acc, item) => {
            acc.merge(item, true)
            return acc
        })]
    }
}

const emptyTags = [
    'area', 'base', 'br', 'col', 'command',
    'embed', 'hr', 'img', 'input', 'keygen',
    'link', 'meta', 'param', 'source', 'track', 'wbr'
]

export class EmptyTagCompiler extends TagCompiler {
    static create (node: SleetNode, stack: SleetNode[]): Compiler | undefined {
        const tag = node as Tag
        if (!tag.name || emptyTags.indexOf(tag.name) === -1) return undefined
        return new EmptyTagCompiler(tag, stack)
    }
    selfClosing () {
        return true
    }
}
