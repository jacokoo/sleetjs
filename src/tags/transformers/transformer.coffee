{Tag} = require '../tag'

exports.Transformer = class Transformer extends Tag
    constructor: ->
        super
        @parent.haveInlineChild = false

    generate: (context) ->
        sub = context.sub(@indent)
        options = @getOptions()
        @generateContent(sub)
        content = sub.getOutput()
        context.push @transform content, options, sub

    transform: (content, options) ->

    needNewLineTokenAfterTagOpen: -> true

    getOptions: ->
        options = {}
        options[key] = value for key, value of item.attributes for item in @attributeGroups
        options

    getContent: ->
        code = []
        if @isString @content
            code.push @content
        else if @isArray @content
            code = code.concat @content
        code.push item for item in @children when @isString(item)

        return code.join '\n'
