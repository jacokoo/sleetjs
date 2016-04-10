'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TagCompiler = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _attribute = require('../ast/attribute');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TagCompiler = exports.TagCompiler = function () {
    function TagCompiler() {
        _classCallCheck(this, TagCompiler);
    }

    _createClass(TagCompiler, [{
        key: 'walk',
        value: function walk(context, tag) {
            var ctx = context;
            var haveInlineChild = false;
            tag.children.forEach(function (item) {
                return context.sub(item);
            });

            tag.inlines.forEach(function (item, i) {
                if (item.inlineChar === '>' || item.inlineChar === ':') {
                    ctx = ctx.sub(item, -1);
                    haveInlineChild = true;
                } else if (item.inlineChar === '+') {
                    ctx = ctx.parent.sub(item, -1);
                } else if (item.inlineChar === '<' && haveInlineChild) {
                    ctx = ctx.parent.parent.sub(item, ctx.parent.parent === context ? -1 : 0);
                    haveInlineChild = false;
                } else {
                    throw new Error('Invalid inline char: ' + item.inlineChar + ' in Tag: ' + item.name);
                }

                if (i === tag.length) item.children.forEach(function (ii) {
                    return ctx.sub(ii);
                });
            });
        }
    }, {
        key: 'compile',
        value: function compile(context, tag) {
            this.tagOpen(context, tag);
            this.content(context, tag);
            this.tagClose(context, tag);
        }
    }, {
        key: 'tagOpen',
        value: function tagOpen(context, tag) {
            this.openStart(context, tag);
            this.openEnd(context, tag);
        }
    }, {
        key: 'openStart',
        value: function openStart(context, tag) {
            this.startIndent(context, tag);
            this.tagStart(context, tag);
            this.attributes(context, tag);
        }
    }, {
        key: 'startIndent',
        value: function startIndent(context, tag) {
            if (!tag.inlineChar) context.eol().indent();
        }
    }, {
        key: 'tagName',
        value: function tagName(context, tag) {
            var name = tag.name || 'div';
            return tag.namespace ? tag.namespace + ':' + name : name;
        }
    }, {
        key: 'tagStart',
        value: function tagStart(context, tag) {
            context.push('<').push(this.tagName(context, tag));
        }
    }, {
        key: 'attributes',
        value: function attributes(context, tag) {
            var note = context.getNote('attribute');
            this.hashDots(context, tag, note);

            tag.attributeGroups && tag.attributeGroups.forEach(function (group) {
                context.getCompiler(group).compile(context, group, tag, note);
            });

            note.each(function (key, value) {
                return context.push(value === null ? ' ' + key : ' ' + key + '="' + value + '"');
            });
            note.clear();
        }
    }, {
        key: 'hashDots',
        value: function hashDots(context, tag, note) {
            if (!tag.hash && tag.dots.length === 0) return;

            var attributes = [];
            if (tag.hash) {
                var value = [new _attribute.Attribute.Quoted(tag.hash)];
                attributes.push(new _attribute.Attribute('id', value));
            }

            if (tag.dots.length > 0) {
                var _value = tag.dots.map(function (item) {
                    return new _attribute.Attribute.Quoted(item);
                });
                attributes.push(new _attribute.Attribute('class', _value));
            }

            var group = new _attribute.Attribute.Group(attributes);
            context.getCompiler(group).compile(context, group, tag, note);
        }
    }, {
        key: 'openEnd',
        value: function openEnd(context, tag) {
            context.push(this.selfClosing(context, tag) ? '/>' : '>');
        }
    }, {
        key: 'selfClosing',
        value: function selfClosing() {
            return false;
        }
    }, {
        key: 'content',
        value: function content(context, tag) {
            this.text(context, tag);
            context.compileChildren();
        }
    }, {
        key: 'text',
        value: function text(context, tag) {
            var ctx = context;
            if (tag.text.length === 0) return;

            if (tag.text.length === 1) {
                ctx.push(tag.text[0]);
                return;
            }

            var indented = ctx.parent.containsIndent;
            var idt = tag.inlineChar ? 1 : 0;
            tag.text.forEach(function (item) {
                if (!item) {
                    ctx.eol();
                    return;
                }
                ctx.eol().indent(idt + 1).push(item);
            });
            ctx.eol().indent(idt);
            ctx.parent.containsIndent = indented;
        }
    }, {
        key: 'tagClose',
        value: function tagClose(context, tag) {
            if (this.selfClosing(context, tag)) return;
            if (context.containsIndent && tag.inlines.length === 0) {
                context.eol().indent();
            }

            this.closeStart(context, tag);
            this.closeEnd(context, tag);
        }
    }, {
        key: 'closeStart',
        value: function closeStart(context, tag) {
            context.push('</').push(this.tagName(context, tag));
        }
    }, {
        key: 'closeEnd',
        value: function closeEnd(context) {
            context.push('>');
        }
    }]);

    return TagCompiler;
}();