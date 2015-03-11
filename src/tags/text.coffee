{Tag} = require './tag'

exports.Text = class Text extends Tag
    constructor: (@options, @parent = {}) ->
        @content = @options.text
        @indent = @options.indent or 0

    generate: (context) ->
        for item in @content
            context.eol().indent(@indent) unless @options.inline
            context.push(item)
