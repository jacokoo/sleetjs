{Transformer} = require './transformer'

exports.Markdown = class Markdown extends Transformer
    transform: (code, options) ->
        marked = require 'marked'
        marked(code, options)
