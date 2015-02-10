pd = require('pretty-data').pd
parser = require './parser/parser'
{Tag} = require './tags'

compile = exports.compile = (input, options) ->
    obj = parser.parse input
    code = (Tag.create(item).getOutput() for item in obj).join ''
    if options and options.pretty is false then code else pd.xml code
