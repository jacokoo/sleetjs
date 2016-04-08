import { TagCompiler } from './tag';

export class CommentCompiler extends TagCompiler {
    tagStart (context, tag) {
        context.push(tag.text.length > 1 ? '<!--' : '// ');
    }

    openEnd () {}

    selfClosing (context, tag) {
        return tag.text.length < 2;
    }

    closeStart (context) {
        context.push('-->');
    }

    closeEnd () {}
}
