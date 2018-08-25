{
    const parents = []
    const ast = options.ast
    const parent = () => parents[parents.length - 1]
    const flatSibling = (nodes) => nodes.reduce((acc, item) => {
        acc.push(item)
        while (acc[acc.length - 1].sibling) {
            const last = acc[acc.length - 1]
            acc.push(last.sibling)
            delete last.sibling
        }
        return acc
    }, [])

    let IDT = 0
    let IDT_TOK = null
    let textIndent = 0
}

start
    = declare: declare_line? blank_line* nodes: nodes? blank_line* _* {
        return {nodes: flatSibling(nodes || []), indent: IDT_TOK || '', declaration: declare}
    }

// declare line start //
declare_line
    = '#!' _* name: identifier
        ext: (_+ i: identifier ! (_* '=') {return i})?
        attr: (_+ kv: key_value_pair {return kv})* eol {

        return new ast.Declaration(name, ext, attr, location())
    }

key_value_pair
    = key: identifier _* '=' _* value: $(!(_ / eol) .)* {
        return {key: key, value: value}
    }

// tag itself start //
nodes
    = start: node rest: (node_sep node: node { return node }) * {
        return rest.unshift(start) && rest
    }

node
    = p: node_parent c: node_child* {
        let cc = c.filter(it => it !== p.sibling)
        if (!p.sibling) cc = flatSibling(cc)
        p._setChildren(cc)
        parents.pop()
        return p
    }

node_parent
    = tag: tag {
        return parents.push(tag) && tag
    }

node_child
    = node_sep indent: node_indent & {
        return indent === parent().indent + 1 ? true : false
    } node: node {
        return node
    }
    / _? [:>] _+ node: node {
        return node
    }
    / _? '+' _+ node: node {
        parent().sibling = node
        return node
    }

node_sep
    = _* eol blank_line* {
        IDT = 0
    }

node_indent
    = indent: idt {
        return IDT = indent || 0
    }

tag
    = body: tag_body text: tag_text? {
        body._setText(text)
        return body
    }

tag_body
    = node_indent? ns: namespace? name: identifier? clazz: tag_class* id: tag_id? clazz2: tag_class* & {
        return name || clazz.length > 0 || id || clazz2.length > 0
    } attrs: attr_groups? extra: tag_extra? {
        return new ast.Tag(IDT, name, ns, clazz.concat(clazz2), id, attrs, extra, location())
    }
    / '|' attrs: attr_groups? {
        return new ast.Tag(IDT, '|', null, [], null, attrs, null, location())
    }
    / '#' {
        return new ast.Tag(IDT, '#', null, [], null, [], null, location())
    }

namespace
    = name: identifier ':' ! _ {
        return name
    }

tag_class
    = '.' name: identifier {
        return name
    }

tag_id
    = '#' name: identifier {
        return name
    }

// tag extra
tag_extra
    = '@' name: identifier values: extra_values? {
        return new ast.TagExtra(name, values, location())
    }

extra_values
    = '(' _* first: extra_value rest: (_+ v: extra_value { return v })*  _* ')' {
        return rest.unshift(first) && rest
    }

extra_value = normal_value / compare_value

// tag text start //
tag_text
    = _* '..' & { textIndent = 0; return true} _* eol text: tag_text_lines { return text }
    / _* '.' & { textIndent = 1; return true} _* eol text: tag_text_lines { return text }
    / _ ! ([:>+] _) text: text_to_end { return text }

tag_text_lines
    = first: ttl rest: (e: (eol { return location()}) l: ttl { return [e, l] })* {
        return rest.reduce((acc, item) => {
            return acc.concat(new ast.StaticText('\\n', item[0])).concat(item[1])
        }, [first])
    }

ttl 'Tag text line'
    = indent: $_* & {
        if (!indent.length) return IDT === 0 && textIndent === 0
        if (IDT_TOK === null) {
            IDT_TOK = indent.indexOf('\t') < 0 ? indent : '\t'
        }
        return indent.length >= (IDT + textIndent) * IDT_TOK.length
    } text: text_to_end {
        const sp = indent.slice((IDT + textIndent) * (IDT_TOK || '').length)
        text.unshift(new ast.StaticText(sp, location()))
        return text
    }
    / ws: $(w: _* & eol {return w} ) {
        const sp = ws.slice((IDT + textIndent) * (IDT_TOK || '').length)
        return new ast.StaticText(sp, location())
    }

text_to_end 'Text to end of line'
    = (static_text / dynamic_text)+

static_text
	= t: (plain_text / '\\$' c: plain_text { return '$' + c } / '\\' c: plain_text { return text() }) {
        return new ast.StaticText(t, location())
    }

plain_text
	= $(! (eol / '$' / '\\') .)+

dynamic_text
    = '$' name: dot_identifier ! '(' {
        return new ast.DynamicText(name, location())
        return {type: 'dynamic', name}
    }
    / '$' name: helper? {
        if (!name) new ast.StaticText('$', location())
        return new ast.DynamicText(name, location())
    }

// tag attribute start //
attr_groups
    = start: attr_group rest: (_* group: attr_group { return group })* {
        return rest.unshift(start) && rest
    }

attr_group
    = _* '(' _* attrs: attr_pairs _* ')' settings: attr_settings? {
        return new ast.AttributeGroup(attrs, settings, location())
    }
    / _* '(' eol attrs: attr_lines _* eol indent: $_* & {
        return (indent || '').length === IDT * IDT_TOK.length
    } ')'  settings: attr_settings? {
        return new ast.AttributeGroup(attrs, settings, location())
    }

attr_lines
    = start: attr_line rest: (_* eol al: attr_line { return al })* {
        return start.concat(rest.reduce((acc, item) => acc.concat(item)))
    }

attr_line
    = indent: $_+ & {
        if (IDT_TOK === null) {
            IDT_TOK = indent.indexOf('\t') < 0 ? indent : '\t'
        }
        return indent.length === (IDT + 1) * IDT_TOK.length
    } pairs: attr_pairs {
        return pairs
    }

attr_pairs
    = start: attr_pair rest: (_* ','? _* pair: attr_pair { return pair })* {
        return rest.unshift(start) && rest
    }

attr_pair 'Attribute pair'
    = ns: namespace key: attr_key ! ( _* '=') {
        return new ast.Attribute(ns, key, [], location())
    }
    / ns: namespace? key: attr_key value: (_* '=' _* v: attr_values {return v}) {
        return new ast.Attribute(ns, key, value, location())
    }
    / value: (_* v: attr_values {return v}) {
        return new ast.Attribute(null, null, value, location())
    }

attr_settings 'Attribute setting'
    = _* '&' ! ([#a-zA-Z0-9]* ';') _* name: identifier attrs:('(' c: attr_pairs ')' { return c })? {
        return new ast.Setting(name, attrs, location())
    }

attr_key = identifier

attr_values
    = start: attr_value rest: (_* '+' _* n: attr_value { return n})* {
        return rest.unshift(start) && rest
    }

attr_value 'Attribute value'
    = helper / normal_value

helper
    = name: identifier? '(' _* attributes: helper_attrs _* ')' {
        return new ast.Helper(name, attributes, location())
    }

helper_attrs
    = start: helper_attr rest: (_* ','? _* v: helper_attr {return v} )* {
        rest.unshift(start)
        return rest
    }

helper_attr
    = name: identifier _* '=' _* value: helper_value {
        return new ast.HelperAttribute(name, value, location())
    }
    / value: helper_value {
        return new ast.HelperAttribute(null, value, location())
    }


transform
    = value: normal_value ts: (_* '|' _* c: (transformer / normal_value) { return c })+ {
        return new ast.TransformValue(value, ts, location())
    }

transformer
    = name: identifier '(' _* first: normal_value rest: (_* v: normal_value {return v})* _* ')' {
        rest.unshift(first)
        return new ast.Transformer(name, rest, location())
    }

string_value = s: quoted_string { return new ast.StringValue(s, location()) }
number_value = n: number { return new ast.NumberValue(n, location()) }
boolean_value = b: boolean { return new ast.BoolanValue(b, location()) }
null_value = 'null' { return new ast.NullValue(location()) }
identifier_value = i: dot_identifier { return new ast.IdentifierValue(i, location()) }

path_identifier_value = p: $([./]+) s: dot_identifier {
    return new ast.IdentifierValue(p + s, location())
}

compare_value 'Compare Operator' = ('==' / '>=' / '<=' / '>' / '<' / '!=') {
    return new ast.CompareOperatorValue(text(), location())
}

normal_value = string_value / number_value / boolean_value / null_value / identifier_value / path_identifier_value
helper_value = transform / normal_value / compare_value

// basic rules start //
blank_line 'Blank line'
    = _* eol

dot_identifier 'Identifier'
    = $(identifier ('.' identifier)*)

identifier 'Identifier'
    = start: [a-zA-Z$@_] rest: $[a-zA-Z0-9$_-]* {
        return start + rest
    }

eol 'End of line'
    = '\n' / '\r' / '\r\n'

_ 'Whitespace'
    = '\t' / ' ' / '\v' / '\f'

idt 'Indents'
    = spaces: $' '+ & {
        if (IDT_TOK === null) IDT_TOK = spaces
        return spaces.length % IDT_TOK.length === 0
    } {
        return spaces.length / IDT_TOK.length
    }
    / tabs: $ '\t'+ & {
        if (IDT_TOK === null) IDT_TOK = '\t'
        return IDT_TOK === '\t'
    } {
        return tabs.length
    }

quoted_string 'Quoted string'
    = '"' chars: $dqs* '"' { return chars }
    / "'" chars: $sqs* "'" { return chars }

dqs 'Double quoted string char'
    = !('"' / '\\' / eol) . { return text() }
    / '\\' char: ec { return char }

sqs 'Single quoted string char'
    = !("'" / '\\' / eol) . { return text() }
    / '\\' char: ec { return char }

ec 'Escaped char'
    = '0' ![0-9] { return '\0' }
    / '"' / "'" / '\\'
    / c: [nfrt] { return '\\' + c }
    / 'b' { return '\x0B' }

boolean 'Boolean'
    = 'true' { return true }
    / 'false' { return false}

number 'Number'
    = sign:[+-]? n: number_def {
        return sign === '-' ? -n : n
    }

number_def
    = '0x'i [0-9a-f]i+ {
        return parseInt(text(), 16)
    }
    / '0' [0-7]+ {
        return parseInt(text(), 8)
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
