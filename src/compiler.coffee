parser = require './parser/parser'
{Tag} = require './tags/tag'
{EmptyTag} = require './tags/empty-tag'
{Predict} = require './tags/predict'
{Doctype} = require './tags/doctype'
{Coffee} = require './tags/transformers/coffee'
{Uglify} = require './tags/transformers/uglify'
{Markdown} = require './tags/transformers/markdown'

class Context
    constructor: (@indentToken = '  ', @newlineToken = '\n') ->
        @result = []
        @tagTypes = {}
        @predictTypes = {}

    sub: ->
        sub = new Context(@indentToken, @newlineToken)
        sub.tagTypes = @tagTypes
        sub.predictTypes = @predictTypes
        sub

    getIndent: (level) ->
        idt = ''
        idt += @indentToken for i in [0...level]
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

    getOutput: -> @result.join ''

emptyTags = ['input', 'br', 'hr', 'link', 'img', 'meta']
defaultTags =
    doctype: Doctype
    coffee: Coffee
    uglify: Uglify
    markdown: Markdown

compile = exports.compile = (input, options = {}) ->
    {tags, indent} = parser.parse input

    context = new Context(indent)
    context.registerTag item, EmptyTag for item in emptyTags
    context.registerTag key, value for key, value of defaultTags

    for key, value of options.tags or {}
        context.registerTag key, value
    for key, value of options.predicts or {}
        context.registerPredict key, value

    for item in tags
        tag = context.createTag item
        tag.generate(context)
        context.eol()
    context.pop()

    context.getOutput()
