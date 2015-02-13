fs = require 'fs'
path = require 'path'
{compile} = require './sleet'

yargs = require('yargs').usage '$0 [options] input.st'
    .describe 'o', 'Output file (the default file is a same name file with a `html` extension)'
    .describe 'w', 'Watch file changes'
    .describe 'v', 'Show the version number'
    .describe 'h', 'Show this message'
    .alias 'o', 'output'
    .alias 'w', 'watch'
    .alias 'v', 'version'
    .alias 'h', 'help'
    .boolean 'v'
    .boolean 'h'
    .boolean 'w'

read = (file = '-') ->
    if file is '-'


exports.run = ->
    argv = yargs.argv
    file = argv._[0]
    yargs.showHelp() if argv.h or not file

    content = fs.readFileSync(file, 'utf8')
    console.log content compile content
    console.log('done')
