{Tag} = require './tag'
{parse} = require '../parser/parser'
fs = require 'fs'

exports.Include = class Include extends Tag
    generate: (context) ->
        file = @content.replace(/^\s*|\s*$/g, '')
        code = fs.readFileSync(file, 'utf8')
        sub = context.sub(@indent)
        {tags} = parse(code)
        sub.generate(tags)
        context.push sub.getOutput()
