fs = require 'fs'
path = require 'path'
compiler = require './compiler'
{Tag} = require './tags'

log = (msg) -> console.log '  ' + msg

err = (msg) ->
  msg += '\n'
  if (log.print) then log(msg) || process.exit(1) else throw msg

help = ->
    log """

    version 0.0.1

    Build a file to .html

    Options:

      -h, --help      You\'re reading it
      -w, --watch     Watch for changes (unsupport)

    Build a single .st file:,

      sleet foo.st    To a same named file (foo.html),
    """

exports.run = ([a, b, c]) ->
    return help() unless c
    dir_path = path.dirname(c) + '/'
    file_name = path.basename(c, path.extname(c)) + '.html'
    html = compiler.compile fs.readFileSync(c).toString()
    fs.writeFile dir_path + file_name, html
