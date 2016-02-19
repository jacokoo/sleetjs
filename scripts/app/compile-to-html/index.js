const sleet = require('sleet');

exports.items = {
    input: 'input',
    output: 'output'
};

exports.store = {
    models: {
        code: { data: { input: `#!handlebars block=helper

doctype html
html
    head
        meta(charset='utf-8')
        title Welcom to Sleetjs
        link(rel='stylesheet' href='index.css')

        # script
        script(type='text/javascript') > uglify(mingle=true) > coffee.
            number = 2
            square = (x) -> x * x
            console.log square number

        # ie conditional comment
        ieif('lt IE 8') > script(src='hello.js')
        @ieif('gte IE 8')
            script(src='script.js')
    body
        .container > p.
            This
            is
            a text block
        #footer
            p The end

        # handlebars
        ul.list-group > each(items)
            li.list-group-item > a(id='item-' + id) > echo(name)

        helper(arg 1 'a')
            p inside the helper
        else
            p the reverse part` } }
    },

    callbacks: {
        compile: function(payload) {
            const input = payload && payload.input || this.models.code.data.input;
            let output, haveError = false;
            try {
                output = sleet.compile(input).content;
            } catch (e) {
                output = e.message;
                haveError = true;
            }

            this.models.code.set({
                input: input,
                output,
                haveError
            }, true);
        }
    }
};

exports.afterRender = function() {
    this.dispatch('compile');
};
