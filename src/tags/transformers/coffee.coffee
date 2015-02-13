{Transformer} = require './transformer'

exports.Coffee = class Coffee extends Transformer
    transform: (code, options) ->
        coffee = require 'coffee-script'
        coffee.compile(code, options)
