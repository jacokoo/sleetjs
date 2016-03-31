{
    var IDT = 0, i = 0, item,
        IDT_TOK = null,
        Tag = options.Tag,
        Declaration = options.Declaration,
        Attribute = options.Attribute,
        parents = [],
        parent = function() {return parents[parents.length - 1];};
}

start
    = declare: declare_line? blank_line* nodes: nodes? blank_line* _* {
        return {nodes: nodes || [], indent: IDT_TOK, declaration: declare};
    }

// declare line start //
declare_line
    = '#!' _* name: identifier
      ext: (_+ i: identifier ! (_* '=') {return i;})?
      attr: (_+ kv: key_value_pair {return kv})* eol {
        return new Declaration(name, ext, attr);
    }

key_value_pair
    = key: identifier _* '=' _* value: $(!(_ / eol) .)* {
        return {key: key, value: value};
    }

// tag itself start //
nodes
    = start: node rest: (node_sep node: node { return node; }) * {
        return rest.unshift(start) && rest;
    }

node
    = p: node_parent c: node_child* {
        p.children = c;
        return p;
    }

node_parent
    = tag: tag {
        return parents.push(tag) && tag;
    }

node_child
    = node_sep indent: node_indent & {
        return indent === parent().indent + 1 ? true : parents.pop() && false;
    } node: node {
        return node;
    }
    / _? c: [:><+] _* node: node {
        node.inlineChar = c;
        return node;
    }

node_sep
    = _* eol blank_line* {
        IDT = 0;
    }

node_indent
    = indent: idt {
        return IDT = indent || 0;
    }

tag
    = body: tag_body text: tag_text? {
        console.log(text, 't');
        body.text = text || [];
        return body;
    }

tag_body
    = node_indent? ns: namespace? name: identifier? clazz: tag_class* id: tag_id? clazz2: tag_class* & {
        return name || clazz.length > 0 || id || clazz2.length > 0
    } attrs: attr_groups? {
        return new Tag(IDT, name, ns, clazz.concat(clazz2), id, attrs);
    }
    / '|' attrs: attr_groups? {
        return new Tag(IDT, '|', null, null, null, attrs);
    }
    / '#' { return new Tag(IDT, '#') }

namespace
    = name: identifier ':' ! _ {
        return name;
    }

tag_class
    = '.' name: identifier {
        return name;
    }

tag_id
    = '#' name: identifier {
        return name;
    }

// tag text start //
tag_text
    = _* '.' _* eol text: tag_text_lines { return text; }
    / _ ! ([:><+]) text: text_to_end { return [text]; }

tag_text_lines
    = first: ttl rest: (eol l: ttl { return l; })* {
        return rest.unshift(first) && rest;
    }

ttl "Tag text line"
    = indent: $_+ & {
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


// tag attribute start //
attr_groups
    = start: attr_group rest: (_* group: attr_group { return group; })* {
        return rest.unshift(start) && rest;
    }

attr_group
    = _* '(' _* attrs: attr_pairs _* ')' settings: attr_settings? {
        return new Attribute.Group(attrs, settings);
    }
    / _* '(' eol attrs: attr_lines _* eol indent: $_* & {
        return (indent || '').length === IDT * IDT_TOK.length;
    } ')'  settings: attr_settings? {
        return new Attribute.Group(attrs, settings);
    }

attr_lines
    = start: attr_line rest: (_* eol al: attr_line { return al; })* {
        for (var i = 0; i < rest.length; i ++) {
            start = start.concat(rest[i]);
        }
        return start;
    }

attr_line
    = indent: $_+ & {
        if (IDT_TOK === null) {
            IDT_TOK = indent.indexOf('\t') < 0 ? indent : '\t';
        }
        return indent.length === (IDT + 1) * IDT_TOK.length;
    } pairs: attr_pairs {
        return pairs;
    }

attr_pairs
    = start: attr_pair rest: (_* ','? _* pair: attr_pair { return pair; })* {
        return rest.unshift(start) && rest;
    }

attr_pair
    = ns: namespace? key: attr_key value: (_* '=' _* v: attr_values {return v;})? {
        return new Attribute(key, value, ns);
    }

attr_settings
    = _* '&' ! ([#a-zA-Z0-9]* ';') _* name: identifier attrs:('(' c: attr_pairs ')' { return c; })? {
        return new Attribute.Settings(name, attrs);
    }

attr_key = $(! (eol / '=' / ')' / _) .)+

attr_values
    = start: attr_value rest: (_* '+' _* n: attr_value { return n;})* {
        return rest.unshift(start) && rest;
    }

attr_value
    = str: quoted_string { return {value: str, type: 'quoted'}; }
    / n: number { return {value: n, type: 'number'}; }
    / b: boolean { return {value: b, type: 'boolean'}; }
    / name: $(identifier) '(' attrs: attr_pairs ')' {
        return new Attribute.Helper(name, attrs);
    }
    / i: $(!(eol / _ / ')' / '+') .)+ { return { value: i, type: 'identifier'}; }

// basic rules start //
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
        return spaces.length % IDT_TOK.length === 0;
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
    / c: [nfrt] { return '\\' + c; }
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
