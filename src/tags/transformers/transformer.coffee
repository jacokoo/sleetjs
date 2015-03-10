{Tag} = require '../tag'

outdentIt = (content, dent) ->
    return content unless dent.length > 0
    content.replace(new RegExp('^' + dent), '').replace(new RegExp('\n' + dent, 'g'), '\n')

indentIt = (content, dent) ->
    return content unless dent.length > 0
    dent + content.replace(new RegExp('\n(?!$)(?! *\n)', 'g'), '\n' + dent)

exports.Transformer = class Transformer extends Tag
    constructor: ->
        super
        @parent.haveInlineChild = false

    generate: (context) ->
        sub = context.sub()
        options = @getOptions()
        @generateContent(sub)
        content = outdentIt sub.getOutput(), context.getIndent(@indent + 1)

        indent = context.getIndent(if @isInline then @indent + 1 else @indent)
        transformed = indentIt @transform(content, options, sub), indent
        context.push(transformed)

    transform: (content, options) ->

    needNewLineTokenAfterTagOpen: -> true

    getOptions: ->
        options = {}
        for item in @attributeGroups
            for i in item.attributes
                options[i.name.value] = if i.value is null or i.value.length is 0 then true else i.value[0].value
        options
