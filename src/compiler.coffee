fs = require 'fs'
path = require 'path'
parser = require './parser/parser'
{Tag} = require './tags'

compile = exports.compile = (input, options) ->
    obj = parser.parse input
    (Tag.create(item).getOutput() for item in obj).join ''

# Logging
log = (msg) -> console.log '  ' + msg

err = (msg) ->
  msg += '\n'
  if (log.print) then log(msg) || process.exit(1) else throw msg

help = ->
    log """

    version 0.0.1

    Builds .st files to .html

    Options:

      -h, --help      You\'re reading it
      -w, --watch     Watch for changes (unsupport)

    Build a single .st file:,

      sleet foo.st    To a same named file (foo.html),
    """

exports.cli = ([a, b, c]) ->
    return help() unless c
    html = compile fs.readFileSync(c).toString()
    dir_path = path.dirname(c) + '/'
    file_name = path.basename(c, path.extname(c)) + '.html'
    fs.writeFile dir_path + file_name, html
