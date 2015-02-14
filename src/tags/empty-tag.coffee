{Tag} = require './tag'

exports.EmptyTag = class EmptyTag extends Tag
    selfClosing: -> true
    generateContent: ->
