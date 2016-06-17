import { TagCompiler } from './tag';

export class MixinReferenceCompiler extends TagCompiler {
    compile (context, tag) {
        if (!tag.hash) {
            throw new Error('Hash property is required for block reference. eg. block#name');
        }

        const def = context.root.getNote('mixin').get(tag.hash);
        this.startIndent(context, tag);
        const indent = context.last(1);
        const replacement = {};
        const keys = Object.keys(def.replacement);
        keys.forEach(item => replacement[item] = def.replacement[item]);

        const group = tag.attributeGroups.length && tag.attributeGroups[0];
        group && group.attributes.forEach(item => {
            if (!item.name) return;
            if (!replacement.hasOwnProperty(item.name)) return;

            replacement[item.name] = context.getCompiler(item).getValue(context, item.value, item, group, tag);
        });

        def.result.forEach((item) => {
            if (item.indexOf('$') > -1) {
                context.push(keys.reduce((acc, k) => acc.replace(new RegExp(`\\$${k}`, 'g'), replacement[k]), item));
                return;
            }

            context.push(item);
            if (item === '\n') context.push(indent);
        });
    }

}
