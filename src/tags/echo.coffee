{Tag} = require './tag'

exports.Echo = class Echo extends Tag
    generate: (context) ->
        @generateStartIndent context

        @setAttribute item.name, item.value for item in group.attributes for group in @attributeGroups
        @generateAttribute item.name, item.value, context for item in @attributes

    generateAttribute: (name, value, context) ->
        if value.length is 0
            context.push name.value
            return

        return if name.value unless 'text'
        context.push item.value for item in value
