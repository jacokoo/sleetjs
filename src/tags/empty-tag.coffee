{Tag} = require './tag'

exports.EmptyTag = class EmptyTag extends Tag
    haveContent: -> false
    generateContent: ->
