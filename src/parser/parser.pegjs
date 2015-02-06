{
    var parents = [],
        IDT = 0,
        getParent = function() {return parents[parents.length - 1];};
}


start
    = blank_line* tags:tags blank_line* {
        return tags;
    }

tags
    = first:tag next:(tag_seperator tag:tag {return tag})* {
        return next.unshift(first) && next;
    }

tag
    = parent:parent_tag children:child_tag* {
        parent.children = (parent.children || []).concat(children);
        return parent;
    }
    / parent:text_parent children:text_child* {
        console.log(parent, children, 'pc');
        children.unshift(parent);
        return children.join('\n');
    }

text_parent
    = text: pipeline {
        return text;
    }

text_child
    = newline indent:indent & {
        return indent > getParent().indent
    } text: pipeline {
        return text;
    }

parent_tag
    = tag:tag_def {
        return parents.push(tag) && tag;
    }

child_tag
    = tag_seperator indent:indent & {
        return indent > getParent().indent ? true : parents.pop() && false
    } child: tag {
        return child;
    }

pipeline
    = "|" text: nobr {
        return text;
    }

tag_def
    = indent? name: keyword? clazz:clazz* id:id? clazz2:clazz* & {
        return name || clazz.length > 0 || id || clazz2.length > 0;
    } attrs:attrs? text: text_tag? {
        return {name: name || 'div', indent: IDT, clazz: clazz.concat(clazz2), id: id, attrs: attrs, text: text};
    }

text_tag
    = "." text: text_block+ {
        return text.join('\n');
    }
    / whitespace* text: nobr {
        return text;
    }

text_block
    = newline indent:text_indent & {
        return indent > IDT;
    } text: nobr {
        return text;
    }


clazz
    = "." text: keyword {
        return text;
    }

id
    = "#" text: keyword {
        return text;
    }

attrs
    = newline? blank_line* whitespace* "("
      first:attr next:(attr_seperator attr:attr {return attr;})*
      newline? blank_line* whitespace* ")"
    {
        var result = {};
        next.unshift(first);
        for (var i = 0; i < next.length; i ++ ) result[next[i].name] = next[i].value;
        return result;
    }

attr
    = name:keyword value:(whitespace? "=" whitespace? str:quoted_string {return str;})? {
        return { name: name, value: value };
    }

quoted_string
    = "'" str:("\\" char:. {return "\\" + char} / [^'])* "'" {
        return str.join('');
    }
    / "\"" str:("\\" char:. {return "\\" + char} / [^\"])* "\"" {
        return str.join('');
    }

attr_seperator
    = whitespace* ("," / newline) blank_line* whitespace* {
    }

nobr
    = text: [^\r\n]+ {
        return text.join('');
    }

keyword
    = first: [a-zA-Z] next: [a-zA-Z0-9_-]* {
        return first + next.join('');
    }

tag_seperator
    = whitespace* newline blank_line* {
        IDT = 0;
    }

blank_line
    = whitespace* newline {
    }

newline
    = br: "\r"?"\n" {
    }

whitespace
    = [ \t]+ {
    }

indent
    = indents: [ \t]+ {
        return IDT = indents.length;
    }

text_indent
    = indents: [ \t]+ {
       return indents.length;
    }
