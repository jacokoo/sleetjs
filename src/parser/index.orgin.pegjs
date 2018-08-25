{
    var IDT = 0,
        IDT_TOK = null,
        textIndent = 0,
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
        return {name: name, extension: ext, attributes: attr};
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
    / _? c: [:><+] _+ node: node {
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
        body.text = text || [];
        return body;
    }

tag_body
    = node_indent? ns: namespace? name: identifier? clazz: tag_class* id: tag_id? clazz2: tag_class* & {
        return name || clazz.length > 0 || id || clazz2.length > 0
    } attrs: attr_groups? extra: tag_extra? {
        return {indent: IDT, name, namespace: ns, dots: clazz.concat(clazz2), hash: id, attributes: attrs, extra}
    }
    / '|' attrs: attr_groups? {
        return {indent: IDT, name: '|', attributes: attrs}
    }
    / '#' {
        return {indent: IDT, name: '#'}
    }

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

// tag extra
tag_extra
    = '@' name: identifier values: extra_values? {
        return {type: 'extra', name, values}
    }

extra_values
    = '(' _* first: extra_value rest: (_+ v: extra_value { return v })*  _* ')' {
        return rest.unshift(first) && rest;
    }

extra_value = normal_value / compare_value

// tag text start //
tag_text
    = _* '..' & { textIndent = 0; return true} _* eol text: tag_text_lines { return text; }
    / _* '.' & { textIndent = 1; return true} _* eol text: tag_text_lines { return text; }
    / _ ! ([:><+] _) text: text_to_end { return [text]; }

tag_text_lines
    = first: ttl rest: (eol l: ttl { return l; })* {
        rest.unshift(first)
        return rest.reduce(function(acc, item) {
            return acc.concat({type: 'static', value: '\\n'}).concat(item)
        })
    }

ttl 'Tag text line'
    = indent: $_* & {
        if (!indent.length) return IDT === 0 && textIndent === 0
        if (IDT_TOK === null) {
            IDT_TOK = indent.indexOf('\t') < 0 ? indent : '\t';
        }
        return indent.length >= (IDT + textIndent) * IDT_TOK.length;
    } text: text_to_end {
        text.unshift({type: 'static', value: indent.slice((IDT + textIndent) * (IDT_TOK || '').length)})
        return text;
    }
    / ws: $(w: _* & eol {return w;} ) {
        return ws.slice((IDT + textIndent) * (IDT_TOK || '').length);
    }

text_to_end 'Text to end of line'
    = (static_text / dynamic_text)+

static_text
	= t: (plain_text / '\\$' c: plain_text { return '$' + c } / '\\' c: plain_text { return text() }) {
    	return {type: 'static', value: t}
    }

plain_text
	= $(! (eol / '$' / '\\') .)+

dynamic_text
    = '$' name: dot_identifier ! '(' {
        return {type: 'dynamic', name}
    }
    / '$' name: helper? {
        if (!name) return {type: 'static', value: '$'}
        return name
    }

// tag attribute start //
attr_groups
    = start: attr_group rest: (_* group: attr_group { return group; })* {
        return rest.unshift(start) && rest;
    }

attr_group
    = _* '(' _* attrs: attr_pairs _* ')' settings: attr_settings? {
        return {type: 'group', attributes: attrs, settings: settings}
    }
    / _* '(' eol attrs: attr_lines _* eol indent: $_* & {
        return (indent || '').length === IDT * IDT_TOK.length;
    } ')'  settings: attr_settings? {
        return {type: 'group', attributes: attrs, settings: settings}
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

attr_pair 'Attribute pair'
    = ns: namespace key: attr_key ! ( _* '=') {
        return {type: 'attribute', name: key, values: [], namespace: ns}
    }
    / ns: namespace? key: attr_key value: (_* '=' _* v: attr_values {return v;}) {
        return {type: 'attribute', name: key, values: value, namespace: ns}
    }
    / value: (_* v: attr_values {return v;}) {
        return {type: 'attribute', values: value}
    }

attr_settings 'Attribute setting'
    = _* '&' ! ([#a-zA-Z0-9]* ';') _* name: identifier attrs:('(' c: attr_pairs ')' { return c; })? {
        return {type: 'setting', name: name, attributes: attrs}
    }

attr_key = identifier

attr_values
    = start: attr_value rest: (_* '+' _* n: attr_value { return n;})* {
        return rest.unshift(start) && rest;
    }

attr_value 'Attribute value'
    = helper / normal_value

helper
    = name: identifier? '(' _* attributes: helper_attrs _* ')' {
        return {type: 'helper', name, attributes}
    }

helper_attrs
    = start: helper_attr rest: (_* ','? _* v: helper_attr {return v} )* {
        rest.unshift(start)
        return rest
    }

helper_attr
    = name: identifier _* '=' _* value: helper_value {
        return {type: 'attribute', name, value}
    }
    / value: helper_value {
        return {type: 'attribute', value}
    }


transform
    = value: normal_value ts: (_* '|' _* c: (transformer / normal_value) { return c })+ {
    	return {type: 'transform', value, transformers: ts}
    }

transformer
    = name: identifier '(' _* first: normal_value rest: (_* v: normal_value {return v})* _* ')' {
        rest.unshift(first)
        return {type: 'transformer', name, values: rest}
    }

string_value = s: quoted_string { return {type: 'quoted', value: s} }
number_value = n: number { return {type: 'number', value: n} }
boolean_value = b: boolean { return {type: 'boolean', value: b}; }
null_value = 'null' { return {type: 'null'} }
identifier_value = i: dot_identifier { return {type: 'identifier', value: i} }
path_identifier_value = p: $([./]+) s: dot_identifier { return {type: 'identifier', value: p + s}}
compare_value 'Compare Operator' = ('==' / '>=' / '<=' / '>' / '<' / '!=') { return {type: 'compare', value: text()} }

normal_value = string_value / number_value / boolean_value / null_value / identifier_value / path_identifier_value
helper_value = transform / normal_value / compare_value

// basic rules start //
blank_line 'Blank line'
    = _* eol

dot_identifier 'Identifier'
    = $(identifier ('.' identifier)*)

identifier 'Identifier'
    = start: [a-zA-Z$@_] rest: $[a-zA-Z0-9$_-]* {
        return start + rest;
    }

eol 'End of line'
    = '\n' / '\r' / '\r\n'

_ 'Whitespace'
    = '\t' / ' ' / '\v' / '\f'

idt 'Indents'
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

quoted_string 'Quoted string'
    = '"' chars: $dqs* '"' { return chars; }
    / "'" chars: $sqs* "'" { return chars; }

dqs 'Double quoted string char'
    = !('"' / '\\' / eol) . { return text(); }
    / '\\' char: ec { return char; }

sqs 'Single quoted string char'
    = !("'" / '\\' / eol) . { return text(); }
    / '\\' char: ec { return char; }

ec 'Escaped char'
    = '0' ![0-9] { return '\0' }
    / '"' / "'" / '\\'
    / c: [nfrt] { return '\\' + c; }
    / 'b' { return '\x0B' }

boolean 'Boolean'
    = 'true' { return true; }
    / 'false' { return false;}

number 'Number'
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
