parser = require './parser/parser'
{Tag} = require './tags'

exports.compile = (input, options) ->
    obj = parser.parse input
    (Tag.create(item).getOutput() for item in obj).join ''
