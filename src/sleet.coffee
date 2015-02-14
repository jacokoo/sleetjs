parser = require './parser'
{Tag} = require './tags/tag'
{EmptyTag} = require './tags/empty-tag'
{Predict} = require './tags/predict'
{Doctype} = require './tags/doctype'
{Include} = require './tags/include'
{Coffee} = require './tags/transformers/coffee'
{Uglify} = require './tags/transformers/uglify'
{Markdown} = require './tags/transformers/markdown'

class Context
    constructor: (@indentToken = '  ', @newlineToken = '\n', @defaultLevel = 0) ->
        @result = []
        @tagTypes = {}
        @predictTypes = {}

    sub: (level) ->
        sub = new Context(@indentToken, @newlineToken, level or @defaultLevel)
        sub.tagTypes = @tagTypes
        sub.predictTypes = @predictTypes
        sub

    getIndent: (level) ->
        idt = ''
        idt += @indentToken for i in [0...level + @defaultLevel]
        idt

    indent: (level) ->
        @result.push @getIndent(level)
        @

    eol: ->
        @result.push @newlineToken
        @

    push: (text) ->
        @result.push text
        @

    pop: ->
        @result.pop()
        @

    last: (length) ->
        @result.slice -length

    registerTag: (name, clazz) ->
        @tagTypes[name] = clazz
        @

    registerPredict: (name, clazz) ->
        @predictTypes[name] = clazz
        @

    createTag: (options, parent) ->
        name = options.name
        clazz = @tagTypes[name] or Tag
        new clazz(options, parent)

    createPredict: (name, options, tag) ->
        clazz = @predictTypes[name] or Predict
        new clazz(options, tag)

    generate: (tags) ->
        for item in tags
            tag = @createTag item
            tag.generate @

    getOutput: -> @result.join ''

emptyTags = ['input', 'br', 'hr', 'link', 'img', 'meta']
defaultTags =
    doctype: Doctype
    coffee: Coffee
    uglify: Uglify
    markdown: Markdown
    '@include': Include

exports.compile = (input, options = {}) ->
    try
        {tags, indent} = parser.parse input
    catch e
        if e instanceof parser.SyntaxError
            throw new Error("#{e.message} [line: #{e.line}, column: #{e.column}]")
        else
            throw e

    context = new Context(indent)
    context.registerTag item, EmptyTag for item in emptyTags
    context.registerTag key, value for key, value of defaultTags

    for key, value of options.tags or {}
        context.registerTag key, value
    for key, value of options.predicts or {}
        context.registerPredict key, value

    context.generate(tags)
    context.getOutput()
