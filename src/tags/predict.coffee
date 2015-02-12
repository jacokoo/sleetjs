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
        @tag.setAttribute key, value for key, value of @attributes
