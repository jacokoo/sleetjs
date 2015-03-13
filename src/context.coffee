{Tag} = require './tags/tag'
{Predict} = require './tags/predict'

exports.Context = class Context
    defaultTag: Tag
    defaultPredict: Predict

    setDefaultTag: (clazz) -> @defaultTag = clazz

    setDefaultPredict: (clazz) -> @defaultPredict = clazz

    registerTag: (name, clazz) ->
        if @parent then @parent.registerTag name, clazz else @tagTypes[name] = clazz
        @

    registerPredict: (name, clazz) ->
        if @parent then @parent.registerPredict name, clazz else @predictTypes[name] = clazz
        @

    registerBlock: (name, block) ->
        if @parent then @parent.registerBlock(name, block) else @blocks[name] = block
        @

    createTag: (options, parent) ->
        return @parent.createTag options, parent if @parent

        name = options.name
        clazz = @tagTypes[name] or @defaultTag
        new clazz(options, parent)

    createPredict: (name, options, tag) ->
        return @parent.createPredict name, options, tag if @parent

        clazz = @predictTypes[name] or @defaultPredict
        new clazz(options, tag)

    getBlock: (name) ->
        return @parent.getBlock(name) if @parent

        block = @blocks[name]
        throw new Error("Block #{name} is not defined") unless block
        block

    constructor: (@options = {}, @indentToken = '  ', @newlineToken = '\n', @defaultLevel = 0, @parent) ->
        @result = []
        @tagTypes = {}
        @predictTypes = {}
        @blocks = {}

    sub: (level) ->
        sub = new Context(@options, @indentToken, @newlineToken, level or @defaultLevel, @)
        sub

    getIndent: (level) ->
        idt = ''
        idt += @indentToken for i in [0...level + @defaultLevel]
        idt

    indent: (level) ->
        @indented = true
        idt = @getIndent level
        @result.push idt if idt.length > 0
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

    generate: (tags) ->
        for item in tags
            tag = @createTag item, options: children: tags
            tag.generate @

    getOutput: ->
        @result.shift() if not @parent and @result[0] is '\n'
        @result.join ''
