{
  var IDT = 0, i = 0, item,
      IDT_TOK = null,
      parents = [],
      parent = function() {return parents[parents.length - 1];};
}

start
    = blank_line* tags: tags blank_line* _* {
        return {tags: tags, indent: IDT_TOK};
    }

//////////////////////
// tag itself start //
//////////////////////
tags
    = start: tag rest: (tag_sep tag: tag { return tag; }) * {
        var tags = [];
        rest.unshift(start);
        for (i = 0; i < rest.length; i ++) {
            item = rest[i];
            tags.push(item);
            if (item.inlineSiblings) tags = tags.concat(item.inlineSiblings);
            delete item.inlineSiblings;
        }
        return tags;
    }

tag
    = p: tag_parent children: tag_child* {
        p.inlineSiblings = p.inlineSiblings || [];
        p.children = p.children || [];
        for(i = 0; i < children.length; i ++) {
            item = children[i];
            (item.isInlineSibling ? p.inlineSiblings : p.children).push(item);
            if (item.inlineSiblings) {
                if (item.isInlineSibling) {
                    p.inlineSiblings = p.inlineSiblings.concat(item.inlineSiblings);
                } else {
                    p.children = p.children.concat(item.inlineSiblings);
                }
            }
            if (item.isInlineChild) p.haveInlineChild = item.isInlineChild;
            delete item.inlineSiblings;
        }
        return p;
    }
    / text: pipeline {
        return {
            text: text,
            name: '[TEXT]',
            indent: IDT
        };
    }
    / text: comment {
        text.name = '[COMMENT]';
        text.indent = IDT;
        return text;
    }

tag_parent
    = tag: tag_def {
        return parents.push(tag) && tag;
    }

tag_child
    = tag_sep indent: tag_indent & {
        return indent === parent().indent + 1 ? true : parents.pop() && false;
    } tag: tag {
        return tag;
    }
    / _? '+' _* tag: tag {
        tag.isInlineSibling = true;
        return tag;
    }
    / _? [:>] _* tag: tag {
        tag.isInlineChild = true;
        return tag;
    }

tag_def
    = tag_indent? name: identifier? clazz: tag_class* id: tag_id? clazz2: tag_class* & {
        return name || clazz.length > 0 || id || clazz2.length > 0
    } attrs: tag_attr_groups? text: (t: tag_text { return t; })? {
        var tag = {
            name: name,
            indent: IDT,
            dot: clazz.concat(clazz2),
            hash: id,
            attributeGroups: attrs || []
        };
        if (text) {
            text.name = '[TEXT]';
            text.indent = text.inline ? IDT : IDT + 1;
            tag.children = [text];
        }
        return tag;
    }

tag_class
    = '.' name: identifier {
        return name;
    }

tag_id
    = '#' name: identifier {
        return name;
    }

tag_indent
    = indent: idt {
        return IDT = indent || 0;
    }

tag_sep
    = _* eol blank_line* {
        IDT = 0;
    }
////////////////////
// tag itself end //
////////////////////

/////////////////////////
// tag attribute start //
/////////////////////////
tag_attr_groups
    = groups: tag_attr_group+ {
        return groups;
    }

tag_attr_group
    = _* '(' attrs:(tag_attr_inline / tag_attr_lines) ')' predict: tag_attr_predict? {
        return {attributes: attrs, predict: predict};
    }

tag_attr_lines
    = _* eol first: tal rest: tal* ws:_* & {
        return ws.length === IDT * IDT_TOK.length
    } {
        return rest.unshift(first) && rest;
    }

tag_attr_inline
    = _* first: taid rest: (tais a: taid {return a;})* _*{
        return rest.unshift(first) && rest;
    }

tag_attr_predict
    = _* '&' ! ([#a-zA-Z0-9]* ';') _* name: identifier content:('(' c: tpc ')' { return c; })? {
        return {name: name, content: content};
    }

tpc "Tag predict content"
    = (!(eol / ')') .)+ {
        return text();
    }

tal "Tag attribute line"
    = indent: tali & {
        return indent === IDT + 1
    } name: tavd value: (_* '=' _* v: talvd {return v;})? tals {
        return {name: name, value: value};
    }

taid "Inline tag attribute definition"
    = name: tavd value: (_* '=' _* v: taivd { return v;})? {
        return {name: name, value: value || []};
    }

takd "Tag attribute key definition"
    = v: ai { return {value: v, type: 'indentifier'}; }
    / tavd

tavd "Tag attribute value definition"
    = str: quoted_string { return {value: str, type: 'quoted'}; }
    / n: number { return {value: n, type: 'number'}; }
    / b: boolean { return {value: b, type: 'boolean'}; }
    / i: ai { return {value: i, type: 'identifier'}; }

taivd "Inline tag attribute value definition"
    = first: tavd next: (_* '+' _* n: tavd { return n;})* {
        return next.unshift(first) && next;
    }

talvd "Tag attribute line value definition"
    = v: taivd _* & (eol / ')') { return v; }
    / v: text_to_end {return [{value: v, type: 'qouted'}]; }

tais "Inline tag attribute seperator"
    = _* ','? _*

tals "Tag attribute line seperator"
    = eol blank_line*

tali "Tag attribute line indent"
    = indent: idt {
        return indent;
    }

ai "Attribute identifier"
    = [a-zA-Z$@_] [a-zA-Z0-9$@_.-]* { return text(); }

///////////////////////
// tag attribute end //
///////////////////////

////////////////////
// tag text start //
////////////////////
tag_text
    = '.' _* eol text: tag_text_lines {
        return {
            text: text
        };
    }
    / _ ! ([+>:]) text: text_to_end {
        return {
            text: [text],
            inline: true
        };
    }

tag_text_lines
    = first: ttl rest: (eol l: ttl { return l; })* {
        return rest.unshift(first) && rest;
    }

ttl "Tag text line"
    = indent: ttli & {
        if (IDT_TOK === null) {
            IDT_TOK = indent.indexOf('\t') < 0 ? indent : '\t';
        }
        return indent.length >= (IDT + 1) * IDT_TOK.length;
    } text: text_to_end {
        return indent.slice((IDT + 1) * IDT_TOK.length) + text;
    }
    / ws: $(w: _* & eol {return w;} ) {
        return ws.slice((IDT + 1) * IDT_TOK.length);
    }

ttli "Tag text line indent"
    = indent: $_+ {
        return indent;
    }
//////////////////
// tag text end //
//////////////////

////////////////////
// pipeline start //
////////////////////
pipeline
    = '|.' _* eol text: pipeline_lines {
        return text;
    }
    / '|' _? text: text_to_end {
        return [text];
    }

pipeline_lines
    = first: pll rest: (eol l: pll { return l; })* {
        return rest.unshift(first) && rest;
    }

pll
    = indent: pi & {
        return indent.length >= (IDT + 1) * IDT_TOK.length;
    } text: text_to_end {
        return indent.slice((IDT + 1) * IDT_TOK.length) + text;
    }
    / ws: $(w: _* & eol { return w; } ) {
        return ws;
    }

pi "Pipeline indent"
    = indent: $_+ {
        return indent;
    }

//////////////////
// pipeline end //
//////////////////

///////////////////
// comment start //
///////////////////
comment
    = '#.' _* eol text: comment_lines {
        return {
          text: text,
        };
    }
    / '#' _ text: text_to_end {
        return { text: [text], inline: true };
    }

comment_lines
    = first: cll rest: (eol l: cll { return l; })* {
        return rest.unshift(first) && rest;
    }

cll
    = indent: ci & {
        if (IDT_TOK === null) {
            IDT_TOK = indent.indexOf('\t') < 0 ? indent : '\t';
        }
        return indent.length >= (IDT + 1) * IDT_TOK.length;
    } text: text_to_end {
        return indent.slice((IDT + 1) * IDT_TOK.length) + text;
    }
    / ws: $(w: _* & eol { return w; } ) {
        return ws;
    }

ci "Comment indent"
    = indent: $_+ {
        return indent;
    }
/////////////////
// comment end //
/////////////////

///////////////////////
// basic rules start //
///////////////////////
blank_line "Blank line"
    = _* eol

text_to_end "Text to end of line"
    = (!eol .)+ {
        return text();
    }

identifier "Identifier"
    = start: [a-zA-Z$@_] rest: $[a-zA-Z0-9$_-]* {
        return start + rest;
    }

eol "End of line"
    = '\n' / '\r' / '\r\n'

_ "Whitespace"
    = '\t' / ' ' / '\v' / '\f'

idt "Indents"
    = spaces: $' '+ & {
        if (IDT_TOK === null) IDT_TOK = spaces;
        return spaces.length % IDT_TOK.length == 0;
    } {
        return spaces.length / IDT_TOK.length;
    }
    / tabs: $ '\t'+ & {
        if (IDT_TOK === null) IDT_TOK = '\t';
        return IDT_TOK === '\t';
    } {
        return tabs.length;
    }

quoted_string "Quoted string"
    = '"' chars: $dqs* '"' { return chars; }
    / "'" chars: $sqs* "'" { return chars; }

dqs "Double quoted string char"
    = !('"' / '\\' / eol) . { return text(); }
    / '\\' char: ec { return char; }

sqs "Single quoted string char"
    = !("'" / '\\' / eol) . { return text(); }
    / '\\' char: ec { return char; }

ec "Escaped char"
    = '0' ![0-9] { return '\0' }
    / '"' / "'" / '\\'
    / c: [bnfrt] { return '\\' + c; }
    / 'b' { return '\x0B' }

boolean
    = 'true' { return true; }
    / 'false' { return false;}

number
    = sign:[+-]? n: number_def {
        return sign === '-' ? -n : n;
    }

number_def
    = '0x'i [0-9a-f]i+ {
        return parseInt(text(), 16);
    }
    / '0' [0-7]+ {
        return parseInt(text(), 8);
    }
    / int? '.' [0-9]+ exponent?  {
        return parseFloat(text())
    }
    / int exponent? {
        return parseFloat(text())
    }

int
    = [1-9] [0-9]* / '0'

exponent
    = 'e'i [+-]? int

/////////////////////
// basic rules end //
/////////////////////
