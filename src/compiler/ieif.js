import { TagCompiler } from './tag';

export class IeifCompiler extends TagCompiler {
    constructor (closeIt) {
        super();
        this.closeIt = closeIt;
    }

    tagStart (context) {
        context.push('<!--[if ');
    }

    openEnd (context) {
        context.push(this.closeIt ? ']><!-->' : ']>');
    }

    attributes (context, tag) {
        if (!tag.attributeGroups || tag.attributeGroups.length < 1) return;

        const attr = tag.attributeGroups[0].attributes[0];
        context.push(attr && attr.value[0].value);
    }

    closeStart () {}

    closeEnd (context) {
        context.push(this.closeIt ? '<!--<![endif]-->' : '<![endif]-->');
    }
}
