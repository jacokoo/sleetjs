{Tag} = require('./tag')

exports.BlockReference = class BlockReference extends Tag
    constructor: (@options) ->
        @name = @options.hash
        throw new Erorr("Hash property is required for block reference. eg. block#name") unless @name
        @indent = @options.indent

        if @options.attributeGroups.length > 0
            @attributeGroup = @options.attributeGroups[0]

    generate: (context) ->
        context.getBlock(@name).generateBlock(context, @)
