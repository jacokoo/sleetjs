import { TagCompiler } from './tag';

const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
};

const escapeHtml = (string) => string.replace(/[&<>"'`=\/]/g, s => map[s]);

export class TextTagCompiler extends TagCompiler {
    compile (context, tag) {
        if (tag.text.length === 0) return;

        let escape = tag.firstAttribute;
        escape && (escape = escape.value[0].value === 'escape');

        context.eol();
        tag.text.forEach(item => context.indent().push(escape ? escapeHtml(item) : item).eol());
        context.pop();
    }
}
