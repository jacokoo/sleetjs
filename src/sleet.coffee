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
{Text} = require './tags/text'
{Echo} = require './tags/echo'
{Ieif} = require './tags/ieif'
{AtIeif} = require './tags/at-ieif'
{BlockDefinition} = require './tags/block-def'
{BlockReference} = require './tags/block-ref'

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
    '[TEXT]': Text
    echo: Echo
    ieif: Ieif
    '@ieif': AtIeif
    block: BlockReference
    '@block': BlockDefinition

createContext = (options) ->
    context = new Context(options)

    context.registerTag item, EmptyTag for item in emptyTags
    context.registerTag key, value for key, value of defaultTags

    context.registerTag key, value for key, value of options.tags or {}
    context.registerPredict key, value for key, value of options.predicts or {}

    context.setDefaultTag options.defaultTag if options.defaultTag
    context.setDefaultPredict options.defaultPredict if options.defaultPredict

    context

compile = (input, options = {}) ->
    try
        {tags, indent, declaration} = parser.parse input
    catch e
        if e instanceof parser.SyntaxError
            throw new Error("#{e.message} [line: #{e.line}, column: #{e.column}]")
        else
            throw e

    context = createContext(options, indent)
    if declaration
        {name, ext, options: opts} = declaration

        if options[name] and options[name].overrideContext
            context = options[name].overrideContext(context, options, opts)
        else if name.slice(0, 6) is 'sleet-'
            mod = require(name)
            context = mod.overrideContext(context, options, opts)
            extension = mod.getDefaultExtension()
        else if name isnt 'sleet'
            mod = require('sleet-' + name)
            context = mod.overrideContext(context, options, opts)
            extension = mod.getDefaultExtension()

        if options[name] and options[name].getDefaultExtension
            extension = options[name].getDefaultExtension()

    context.indentToken = indent
    context.generate(tags)
    content: context.getOutput(), extension: ext or extension or options.extension or 'html'

module.exports =
    compile: compile
    Tag: Tag
    EmptyTag: EmptyTag
    Predict: Predict
    Transformer: Transformer
    Echo: Echo
    BlockDefinition: BlockDefinition
    BlockReference: BlockReference
