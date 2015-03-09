toString = Object.prototype.toString
isString = (str) -> toString.call(str) is '[object String]'
isArray = (arr) -> toString.call(arr) is '[object Array]'

exports.Tag = class Tag
    constructor: (@options, @parent = {}) ->
        @attributes = []
        @content = @options.text or ''
        @name = @options.name or 'div'
        @indent = @options.indent or 0

        @setAttribute('id', @options.hash) if @options.hash
        @setAttribute('class', dot) for dot in @options.dot
        @attributeGroups = @options.attributeGroups
        @children = @options.children

        @haveInlineChild = false
        @isInline = @indent is @parent.indent
        @parent.haveInlineChild = @isInline

    isString: isString
    isArray: isArray

    setAttribute: (name, value) ->
        name = value: name, type: 'identifier' if isString name
        value = [] if value is null
        value = [value: value, type: 'quoted'] if isString value

        attr = item for item in @attributes when item.name.value is name.value and item.name.type is name.type
        if attr then attr.value = attr.value.concat value else @attributes.push name: name, value: value

    generate: (context) ->
        @generateOpenStart(context)
        @generateAttributes(context)
        @generateOpenEnd(context)
        @generateContent(context)
        @generateClose(context)

    generateOpenStart: (context) ->
        if @isInline
            context.pop()
        else
            context.indent(@indent)

        context.push('<').push(@name)

    generateAttributes: (context) ->
        for item in @attributeGroups
            if item.predict
                predict = context.createPredict(item.predict.name, item, @)
                predict.generate context
            else
                @setAttribute item.name, item.value for item in item.attributes

        @generateAttribute item, context for item in @attributes

    generateAttribute: ({name, value}, context) ->
        value or= []
        context.push(' ').push name.value
        if name.value is 'class'
            return context.push('="').push((item.value for item in value).join ' ').push('"')

        value.push name if value.length is 0

        context.push('="').push((item.value for item in value).join '').push('"')

    generateOpenEnd: (context) ->
        context.push(if not @selfClosing() then '>' else '/>')
        context.eol() if @needNewLineTokenAfterTagOpen() or @selfClosing()

    needNewLineTokenAfterTagOpen: ->
        return true if @children.length > 0
        return true if isArray(@content)
        false

    needTextIndent: ->
        @needNewLineTokenAfterTagOpen() and isString(@content)

    selfClosing: -> false

    generateContent: (context) ->
        if @content
            context.indent(@indent + 1) if @needTextIndent()
            context.push if isString(@content) then @content else @content.join(context.newlineToken)
            context.eol() if @needTextIndent() or isArray(@content)

        for item in @children
            if isString(item)
                context.push(item).eol()
            else
                context.createTag(item, @).generate(context)

    generateClose: (context) ->
        return if @selfClosing()
        context.indent(@indent) if @needNewLineTokenAfterTagOpen() and not @haveInlineChild
        context.pop() if @haveInlineChild
        context.push('</').push(@name).push('>').eol()
