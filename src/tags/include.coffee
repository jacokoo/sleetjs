{Tag} = require './tag'
{parse} = require '../parser'
fs = require 'fs'
path = require 'path'

exports.Include = class Include extends Tag
    generate: (context) ->
        file = @getContent()
        filename = context.options.filename or path.resolve('.')
        filename = path.dirname(filename) if fs.statSync(filename).isFile()
        file = path.resolve(filename, file)

        code = fs.readFileSync(file, 'utf8')
        sub = context.sub(@indent)
        {tags} = parse(code)
        sub.generate(tags)
        context.push sub.getOutput()

    getContent: ->
        return '' if @children.length isnt 1
        text = @children[0]
        return '' unless text.inline
        return text.text[0].trim()
