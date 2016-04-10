import { TagCompiler } from './tag';

export class CommentCompiler extends TagCompiler {
    tagStart (context, tag) {
        context.push('<!--');
        if (tag.text.length === 1) context.push(' ');
    }

    openEnd () {}

    closeStart (context, tag) {
        if (tag.text.length === 1) context.push(' ');
        context.push('-->');
    }

    closeEnd () {}
}
