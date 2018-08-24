import { TagCompiler } from './tag';

export class EchoCompiler extends TagCompiler {
    compile (context, tag) {
        if (!tag.attributeGroups.length) return;
        this.startIndent(context, tag);

        const result = tag.attributeGroups.map(item => item.attributes.map(a =>
            a.value.map(v => v.value).join('')).join(''));
        context.push(result.join(''));
    }
}
