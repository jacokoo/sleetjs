import { Attribute } from '../ast/attribute';

export class TagCompiler {
    walk (context, tag) {
        let ctx = context;
        let haveInlineChild = false;
        tag.children.forEach(item => context.sub(item));

        tag.inlines.forEach((item, i) => {
            if (item.inlineChar === '>' || item.inlineChar === ':') {
                ctx = ctx.sub(item, -1);
                haveInlineChild = true;
            } else if (item.inlineChar === '+') {
                ctx = ctx.parent.sub(item, -1);
            } else if (item.inlineChar === '<' && haveInlineChild) {
                ctx = ctx.parent.parent.sub(item, ctx.parent.parent === context ? -1 : 0);
                haveInlineChild = false;
            } else {
                throw new Error(`Invalid inline char: ${item.inlineChar} in Tag: ${item.name}`);
            }

            if (i === tag.length) item.children.forEach(ii => ctx.sub(ii));
        });
    }

    compile (context, tag) {
        this.tagOpen(context, tag);
        this.content(context, tag);
        this.tagClose(context, tag);
    }

    tagOpen (context, tag) {
        this.openStart(context, tag);
        this.openEnd(context, tag);
    }

    openStart (context, tag) {
        this.startIndent(context, tag);
        this.tagStart(context, tag);
        this.attributes(context, tag);
    }

    startIndent (context, tag) {
        if (!tag.inlineChar) context.eol().indent();
    }

    tagName (context, tag) {
        const name = tag.name || 'div';
        return tag.namespace ? `${tag.namespace}:${name}` : name;
    }

    tagStart (context, tag) {
        context.push('<').push(this.tagName(context, tag));
    }

    attributes (context, tag) {
        this.hashDots(context, tag);

        tag.attributeGroups && tag.attributeGroups.forEach((group) => {
            context.getCompiler(group).compile(context, group, tag);
        });

        context.eachNote((key, value) => context.push(value === null ? key : ` ${key}="${value}"`));
        context.clearNote();
    }

    hashDots (context, tag) {
        if (!tag.hash && tag.dots.length === 0) return;

        const attributes = [];
        if (tag.hash) {
            const value = [new Attribute.Quoted(tag.hash)];
            attributes.push(new Attribute('id', value));
        }

        if (tag.dots.length > 0) {
            const value = tag.dots.map(item => new Attribute.Quoted(item));
            attributes.push(new Attribute('class', value));
        }

        const group = new Attribute.Group(attributes);
        context.getCompiler(group).compile(context, group, tag);
    }

    openEnd (context, tag) {
        context.push(this.selfClosing(context, tag) ? '/>' : '>');
    }

    selfClosing () {
        return false;
    }

    content (context, tag) {
        this.text(context, tag);
        context.compileChildren();
    }

    text (context, tag) {
        const ctx = context;
        if (tag.text.length === 0) return;

        if (tag.text.length === 1) {
            ctx.push(tag.text[0]);
            return;
        }

        const indented = ctx.parent.containsIndent;
        const idt = tag.inlineChar ? 1 : 0;
        tag.text.forEach(item => {
            if (!item) {
                ctx.eol();
                return;
            }
            ctx.eol().indent(idt + 1).push(item);
        });
        ctx.eol().indent(idt);
        ctx.parent.containsIndent = indented;
    }

    tagClose (context, tag) {
        if (this.selfClosing(context, tag)) return;
        if (context.containsIndent && tag.inlines.length === 0) {
            context.eol().indent();
        }

        this.closeStart(context, tag);
        this.closeEnd(context, tag);
    }

    closeStart (context, tag) {
        context.push('</').push(this.tagName(context, tag));
    }

    closeEnd (context) {
        context.push('>');
    }
}
