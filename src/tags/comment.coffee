{Tag} = require './tag'

exports.Comment = class Comment extends Tag
    constructor: (@options, @parent = {}) ->
        @content = @options.text
        @indent = @options.indent or 0

    generate: (context) ->
        @childrenContext = context.sub()

        @generateOpenStart context
        @generateContent @childrenContext
        context.push @childrenContext.getOutput()

        @generateClose context

    generateTagStart: (context) ->
        context.push('<!--')

    generateTagEnd: (context) ->
        context.push '-->'

    generateContent: (context) ->
        for item in @content
            context.eol().indent(@indent + 1) unless @options.inline
            context.push(item)
