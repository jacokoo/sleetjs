{Tag} = require './tags/tag'
{Predict} = require './tags/predict'

exports.Context = class Context
    constructor: (@options = {}, @indentToken = '  ', @newlineToken = '\n', @defaultLevel = 0) ->
        @result = []
        @tagTypes = {}
        @predictTypes = {}

    sub: (level) ->
        sub = new Context(@options, @indentToken, @newlineToken, level or @defaultLevel)
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
