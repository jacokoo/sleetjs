parser = require './parser'
{Context} = require './context'
{Tag} = require './tags/tag'
{EmptyTag} = require './tags/empty-tag'
{Predict} = require './tags/predict'
{Doctype} = require './tags/doctype'
{Include} = require './tags/include'
{Coffee} = require './tags/transformers/coffee'
{Uglify} = require './tags/transformers/uglify'
{Markdown} = require './tags/transformers/markdown'
{Transformer} = require './tags/transformers/transformer'
{Comment} = require './tags/comment'

emptyTags = [
    'area', 'base', 'br', 'col', 'command'
    'embed', 'hr', 'img', 'input', 'keygen'
    'link', 'meta', 'param', 'source', 'track', 'wbr'
]

defaultTags =
    doctype: Doctype
    coffee: Coffee
    uglify: Uglify
    markdown: Markdown
    '[COMMENT]': Comment
    '@include': Include

compile = (input, options = {}) ->
    try
        {tags, indent} = parser.parse input
    catch e
        if e instanceof parser.SyntaxError
            throw new Error("#{e.message} [line: #{e.line}, column: #{e.column}]")
        else
            throw e

    context = options.context or new Context()
    context.indentToken = indent
    context.options = options

    context.registerTag item, EmptyTag for item in emptyTags
    context.registerTag key, value for key, value of defaultTags

    for key, value of options.tags or {}
        context.registerTag key, value
    for key, value of options.predicts or {}
        context.registerPredict key, value

    context.generate(tags)
    context.getOutput()

module.exports =
    compile: compile
    Tag: Tag
    EmptyTag: EmptyTag
    Predict: Predict
    Transformer: Transformer
