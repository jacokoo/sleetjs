toString = Object.prototype.toString
isString = (str) -> toString.call(str) is '[object String]'
isArray = (arr) -> toString.call(arr) is '[object Array]'

exports.Tag = class Tag
    constructor: (@options, @parent = {}) ->
        @attributes = []
        @name = @options.name or 'div'
        @indent = @options.indent or 0

        @setAttribute('id', @options.hash) if @options.hash
        @setAttribute('class', dot) for dot in @options.dot or []
        @attributeGroups = @options.attributeGroups or []
        @children = @options.children or []

    isString: isString
    isArray: isArray

    setAttribute: (name, value) ->
        name = value: name, type: 'identifier' if isString name
        value = [value: value, type: 'quoted'] if isString value

        attr = item for item in @attributes when item.name.value is name.value and item.name.type is name.type
        if attr then attr.value = attr.value.concat value else @attributes.push name: name, value: value

    generate: (context) ->
        @childrenContext = context.sub()

        @generateOpenStart(context)
        @generateAttributes(context)
        @generateOpenEnd(context)

        @generateContent(@childrenContext)
        context.push @childrenContext.getOutput()

        @generateClose(context)

    generateOpenStart: (context) ->
        @generateStartIndent context
        @generateTagStart context

    generateStartIndent: (context) ->
        context.eol().indent(@indent) unless @options.isInlineChild or @options.isInlineSibling

    generateTagStart: (context) ->
        context.push('<').push(@name)

    generateAttributes: (context) ->
        for item in @attributeGroups
            if item.predict
                predict = context.createPredict(item.predict.name, item, @)
                predict.generate context
            else
                @setAttribute i.name, i.value for i in item.attributes

        @generateAttribute item, context for item in @attributes

    generateAttribute: ({name, value}, context) ->
        context.push(' ').push name.value
        if name.value is 'class'
            return context.push('="').push((item.value for item in value).join ' ').push('"')

        value.push name if value.length is 0

        context.push('="').push((item.value for item in value).join '').push('"')

    generateOpenEnd: (context) ->
        context.push(if not @selfClosing() then '>' else '/>')

    selfClosing: -> false

    generateContent: (context) ->
        context.createTag(item, @).generate(context) for item in @children

    generateClose: (context) ->
        return if @selfClosing()
        context.eol().indent(@indent) if @childrenContext.indented and not @options.haveInlineChild
        @generateTagEnd context

    generateTagEnd: (context) ->
        context.push('</').push(@name).push('>')
