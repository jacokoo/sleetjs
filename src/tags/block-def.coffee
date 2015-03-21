{Tag} = require('./tag')

exports.BlockDefinition = class BlockDefinition extends Tag
    constructor: (@options) ->
        @name = @options.hash
        throw new Erorr("Hash property is required for block definition. eg. @block#name") unless @name

        @indent = @options.indent
        throw new Error("Block definition must be placed in top level(the indent of it must be 0)") unless @indent is 0

        if @options.attributeGroups.length > 0
            @attributeGroup = @options.attributeGroups[0]
        else
            @attributeGroup = attributes: []

    generate: (context) ->
        context.registerBlock @name, @
        @attributes = @getAttributes(context, @attributeGroup)

    generateBlock: (context, block) ->
        context.indent(0) # make context indented
        sub = context.sub(block.indent - 1)
        sub.createTag(item, @).generate(sub) for item in @options.children
        content = sub.getOutput()

        attributes = if block.attributeGroup then @getAttributes(context, block.attributeGroup) else {}
        merged = {}
        merged[key] = attributes[key] or value for key, value of @attributes

        content = @processReplacement(content, merged)
        if context.isEmpty() and content.charAt(0) is '\n'
            content = content.slice 1
        context.push content

    getAttributes: (context, attributeGroup) ->
        sub = context.sub()
        tag = attributeGroups: [attributeGroup]
        sub.createTag(tag).generateAttributes(sub)

        r = /([a-zA-Z$@_][a-zA-Z0-9$@_.-]*)\s*=\s*('([^']*)'|"([^"]*)")/g
        content = sub.getOutput()
        attrs = {}
        attrs[m[1]] = m[3] or m[4] while m = r.exec content
        return attrs

    processReplacement: (content, attributes) ->
        for key, value of attributes
            r = new RegExp("\\$#{key}", 'g')
            content = content.replace r, value
        content
