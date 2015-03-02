###
# attribute group predict
#
# predicts are all ignored by default
#
###
exports.Predict = class Predict
    constructor: (options, @tag) ->
        @attributes = options.attributes
        @content = options.predict.content

    generate: (context) ->
        @tag.setAttribute item.name, item.value for item in @attributes
