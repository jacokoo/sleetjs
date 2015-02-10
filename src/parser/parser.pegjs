{
  var IDT = 0,
      IDT_TOK = null,
      parents = [],
      parent = function() {return parents[parents.length - 1];};
}

start
    = blank_line* tags: tags blank_line* _* {
        return tags;
    }

//////////////////////
// tag itself start //
//////////////////////
tags
    = start: tag rest: (tag_sep tag: tag { return tag; }) * {
        return rest.unshift(start) && rest;
    }

tag
    = parent: tag_parent children: tag_child* {
        parent.children = (parent.children || []).concat(children);
        return parent;
    }
    / parent: pipeline_parent children: pipeline_child* {
        return children.unshift(parent) && children.join('\n');
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
    
tag_def
    = tag_indent? name: identifier? clazz: tag_class* id: tag_id? clazz2: tag_class* & {
        return name || clazz.length > 0 || id || clazz2.length > 0
    } attrs: tag_attrs? text: (t: tag_text { return t; })? {
        return { name: name, indent: IDT, clazz: clazz.concat(clazz2), id: id, attrs: attrs, text: text };
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
tag_attrs
    = _* '(' attrs:(tag_attrs_inline / tag_attrs_lines) _* ')'{
        var result = {}, i;
        for (i = 0; i < attrs.length; i ++) if(attrs[i]) result[attrs[i].name] = attrs[i].value;
        return result;
    }
    
tag_attrs_lines
    = _* eol first: tal rest: (eol l: tal { return l; })* {
        return rest.unshift(first) && rest;
    }

tal "Tag attribute line"
    = indent: tali & {
        return indent === IDT + 1
    } name: identifier value: (_* '=' _* str: (quoted_string / text_to_end) {return str;})? tale? {
        return { name: name, value: value };
    }
    / tale
    
tale "Tag attribute line end"
    = indent: tali? & {
        if (indent === IDT) return true;
        return false;
    } {
        return undefined;
    }
    / ws:_* & {
        return IDT === 0 && ws.length === 0;
    } {
        return undefined;
    }

tag_attrs_inline
    = _* first: taid rest: (tais a: taid { return a;})* {
        return rest.unshift(first) && rest;
    }

taid "Inline tag attribute definition"
    = name: identifier value: (_* '=' _* str: (quoted_string / identifier) { return str;})? {
        return { name: name, value: value };
    }

tais "Inline tag attribute seperator"
    = _* ','? _*
    
tali "Tag attribute line indent"
    = indent: idt {
        return indent;
    }
///////////////////////
// tag attribute end //
///////////////////////

////////////////////
// tag text start //
////////////////////
tag_text
    = '.' _* eol text: tag_text_lines {
        return text;
    }
    / _+ text: text_to_end {
        return text;
    }
    
tag_text_lines
    = first: ttl rest: (eol l: ttl { return l; })* {
        return rest.unshift(first) && rest.join('\n');
    }
    
ttl "Tag text line"
    = indent: ttli & {
        return indent.length >= (IDT + 1) * IDT_TOK.length;
    } text: text_to_end {
        return indent + text;
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
pipeline_parent
    = text: pipeline {
        return text;
    }

pipeline_child
    = eol indent: pi & {
        return indent === parent().indent + 1;
    } text: pipeline_parent {
        return text;
    }

pipeline
    = '|.' _* eol text: pipeline_lines {
        return text;
    }
    / '|' _* text: text_to_end {
        return text;
    }
    
pipeline_lines
    = first: pll rest: (eol l: pll {return l;})* {
        return rest.unshift(first) && rest.join('\n');
    }
    
pll 
    = indent: pi & {
        return indent.length >= (IDT + 1) * IDT_TOK.length;
    } text: text_to_end {
        return indent.slice(IDT_TOK.length) + text;
    }

pi "Pipeline indent"
    = indent: $_+ {
        return indent;
    }

//////////////////
// pipeline end //
//////////////////

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
    = !("'" / '\\' / eol) . {return text(); }
    / '\\' char: ec {return char; }

ec "Escaped char"
    = '0' ![0-9] { return '\0' }
    / '"' / "'" / '\\'
    / c: [bnfrt] { return '\\' + c; }
    / 'b' { return '\x0B' }
    
/////////////////////
// basic rules end //
/////////////////////
