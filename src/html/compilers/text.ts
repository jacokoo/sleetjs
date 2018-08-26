import { Compiler, Context } from '../context'
import { NodeType, SleetNode, Tag, SleetValue, SleetText, StaticText, IdentifierValue } from '../../ast'

const map: {[name: string]: string} = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
};

const escapeHtml = (string: string) => string.replace(/[&<>"'`=\/]/g, s => map[s])

export class TextCompiler implements Compiler {
    static type = NodeType.Tag

    static create (node: SleetNode, stack: SleetNode[]): Compiler | undefined {
        if ((node as Tag).name === '|') return new TextCompiler(node as Tag)
    }

    private tag: Tag

    constructor(node: Tag) {
        this.tag = node
    }

    compile (context: Context) {
        if (!this.tag.text.length) return

        let escape = this.escape()

        const lines = this.tag.text.filter(it => !!it.length)
        if (!this.inline()) context.eol()
        lines.forEach(line => {
            if (!line.some(it => !!it.toHTMLString().length)) {
                context.eol()
                return
            }

            if (!this.inline()) context.indent()
            line.forEach(it => {
                const text = it.toHTMLString()
                context.push(escape ? escapeHtml(text) : text)
            })
            context.eol()
        });
        context.pop();
    }

    escape () {
        return this.tag.namespace === 'escape'
    }

    inline () {
        return this.tag.namespace === 'inline'
    }
}
