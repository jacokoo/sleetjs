{Transformer} = require './transformer'

exports.Uglify = class Uglify extends Transformer
    transform: (code, options) ->
        uglify = require 'uglify-js'
        options.fromString = true
        uglify.minify(code, options).code + '\n'
