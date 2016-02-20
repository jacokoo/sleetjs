const sleet = require('sleet');
const handlebars = require('handlebars-sleet');
const templates = {
    sleet: `#!handlebars block=helper

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
            p the reverse part`,
    html: `<!--
    convert html/handlebars to sleet
-->

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Welcom to Sleetjs</title>
        <script type="text/javascript">
            var a = 10;
            console.log(a);
        </script>
    </head>
    <body>
        <!-- multiple line text -->
        <p>
            first line
            second line
        </p>

        <!-- handlebars -->
        <ul class="list-group">{{#each items}}
            <li class="list-group-item"><a id="item-{{id}}">{{name}}</a></li>
        {{/each}}</ul>
    </body>
</html>
`
};

exports.items = {
    input: 'input',
    output: 'output'
};

exports.store = {
    models: {
        state: { data: { from: 'sleet', to: 'HTML/Handlebars' } },
        input: { data: templates.sleet },
        output: '',
    },

    callbacks: {
        compile: function(payload) {
            const input = payload && payload.input || this.models.input.data
            const compiler = this.models.state.data.from === 'sleet' ? sleet.compile : handlebars.convert;
            let output;
            try {
                output = compiler(input);
                output.content && (output = output.content);
            } catch (e) {
                output = e.message;
            }

            this.models.output.set(output, true);
        },

        reverseIt: function() {
            const model = this.models.state, tpl = model.data.from === 'sleet' ? templates.html : templates.sleet;
            model.set({
                from: model.data.to,
                to: model.data.from
            }, true);

            this.models.input.set(tpl, true);
            this.module.dispatch('compile', { input: tpl });
        }
    }
};

exports.afterRender = function() {
    this.dispatch('compile');
};
