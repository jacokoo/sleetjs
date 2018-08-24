import { TagCompiler } from './tag';

export class MixinDefinitionCompiler extends TagCompiler {
    compile (context, tag) {
        if (!tag.hash) {
            throw new Error('Hash property is required for block definition. eg. @mixin#name');
        }

        if (tag.indent !== 0) {
            throw new Error('Block definition must be placed in top level(the indent of it must be 0)');
        }

        const ctx = context.sub(tag, -2);
        ctx.compileChildren();
        const result = ctx.getOutput(true);
        result.shift(); // remove the leading \n

        const group = tag.attributeGroups.length && tag.attributeGroups[0].attributes;
        const replacement = {};

        group && group.forEach(item => {
            const value = context.getCompiler(item).getValue(context, item.value, item, group, tag);
            item.name ? replacement[item.name] = value : replacement[value] = null;
        });

        context.root.getNote('mixin').set(tag.hash, { result, replacement });
    }
}
