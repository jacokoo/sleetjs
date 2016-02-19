const sleet = require('sleet');

exports.items = {
    input: 'input',
    output: 'output'
};

exports.store = {
    models: {
        code: { data: { input: `a\n    p hello` } }
    },

    callbacks: {
        compile: function(payload) {
            let output, haveError = false;
            try {
                output = sleet.compile(payload.input).content;
            } catch (e) {
                output = e.message;
                haveError = true;
            }

            this.models.code.set({
                input: payload.input,
                output,
                haveError
            }, true);
        }
    }
};
