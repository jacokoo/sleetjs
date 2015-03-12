{Tag} = require './tag'

exports.Ieif = class Ieif extends Tag

    generateTagStart: (context) ->
        context.push '<!--[if '

    generateOpenEnd: (context) ->
        context.push ']>'

    generateAttributes: (context) ->
        return unless @attributeGroups.length > 0
        group = @attributeGroups[0]
        return unless group.attributes.length is 1
        attr = group.attributes[0]
        return unless attr.name.type is 'quoted'
        context.push attr.name.value

    generateTagEnd: (context) ->
        context.push '<![endif]-->'
