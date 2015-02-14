{Tag} = require './tag'

exports.Comment = class Comment extends Tag
    constructor: (@options, @parent = {}) ->
        @content = @options.text or ''
        @indent = @options.indent or 0

    generate: (context) ->
        context.indent(@indent)
        context.push('<!--')
        if @isArray(@content)
            context.eol().push(@content.join('\n'))
            context.indent(@indent).push('-->').eol()
        else
            context.push(' ').push(@content).push(' -->').eol()
