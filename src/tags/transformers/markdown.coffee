{Transformer} = require './transformer'

exports.Markdown = class Markdown extends Transformer
    transform: (code, options, context) ->
        marked = require 'marked'
        indent = context.getIndent @indent + 1
        c = code.replace(new RegExp('^' + indent), '').replace(new RegExp('\n' + indent, 'g'), '\n')
        marked(c, options)
