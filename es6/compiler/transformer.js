import { TagCompiler } from './tag';

export class TransformerCompiler extends TagCompiler {
    compile (context, tag) {
        const content = this.getContent(context, tag);
        const options = this.getOptions(context, tag);

        const result = this.transform(context, content, options);
        const inline = !!tag.inlineChar;
        result.split('\n').forEach(item => context.eol().indent(inline ? 1 : 0).push(item));
        inline && context.eol().indent();
    }

    getContent (context, tag) {
        const ctx = context;
        const idt = ctx._indent;
        ctx._indent = -1;
        this.content(ctx, tag);
        const content = ctx.getOutput();
        ctx._result = [];
        ctx._indent = idt;
        return content;
    }

    getOptions (context, tag) {
        const options = {};
        if (!tag.attributeGroups) return options;

        tag.attributeGroups.forEach(group => group.attributes.forEach(attr => {
            if (!attr.name) return;
            options[attr.name] = attr.value[0].value;
        }));
        return options;
    }

    transform () {}
}
