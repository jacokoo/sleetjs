{Ieif} = require './ieif'

exports.AtIeif = class AtIeif extends Ieif

    generateOpenEnd: (context) ->
        context.push ']><!-->'

    generateTagEnd: (context) ->
        context.push '<!--<![endif]-->'
