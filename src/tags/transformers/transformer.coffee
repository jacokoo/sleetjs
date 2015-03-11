{Tag} = require '../tag'

indentIt = (content, dent, inline) ->
    return content unless dent.length > 0
    content.replace(new RegExp('\n(?!$)(?! *\n)', 'g'), '\n' + dent)

exports.Transformer = class Transformer extends Tag
    constructor: ->
        super
        @parent.options.haveInlineChild = false

    generate: (context) ->
        indent = if @options.isInlineChild then @indent + 1 else @indent
        context.eol().indent(indent)

        sub = context.sub(-@indent - 1)
        @generateContent sub
        options = @getOptions()
        content = sub.getOutput()

        transformed = indentIt @transform(content, options, sub), context.getIndent(indent)
        context.push(transformed)

    transform: (content, options) ->

    getOptions: ->
        options = {}
        for item in @attributeGroups
            for i in item.attributes
                options[i.name.value] = if i.value is null or i.value.length is 0 then true else i.value[0].value
        options
