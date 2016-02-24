```
   _____ _           _          _
  / ____| |         | |        | |
 | (___ | | ___  ___| |_       | |___
  \___ \| |/ _ \/ _ \ __|  _   | / __|
  ____) | |  __/  __/ |_  | |__| \__ \
 |_____/|_|\___|\___|\__|  \____/|___/
```

# Sleetjs
Sleetjs is a litte indent-based language that compiles into HTML/XML.

It is not a template engine , so it can't render data.
However, you can override tags to generate a output file that can be used to
render data with a template engine.

[Try it online](http://jacokoo.github.io/sleetjs)

[中文文档](https://github.com/JacoKoo/sleetjs/blob/master/README.cn.md)

## Resources
* [Sleet-Handlebars](https://github.com/JacoKoo/sleet-handlebars) A sleet extension that compiles Sleet file to Handlebars template.
* [Atom-Sleet](https://github.com/JacoKoo/atom-sleet) Sleet and Sleet Handlebars plugin(Syntax highlight, Compile on save, Preview) for [Atom](https://atom.io).
* [Handlebars-Sleet](https://github.com/JacoKoo/handlebars-sleet) Convert exist HTML / HBS(Handlebars template) files to Sleet

## Screenshot
![Screenshot](https://raw.githubusercontent.com/JacoKoo/atom-sleet/master/screenshot.jpg)

## Installation
Make sure you have npm installed, then

    $ npm install -g sleet

## Command line usage

    $ sleet [options] input1 [input2...]

Sleet compiles input files to html/xml files. It can take multiple inputs,
either file or directory. For the directory input, it will scan the directory
recursively to find these files whose extension is `.sleet` and compile them.

$ sleet -h
/usr/local/bin/sleet [options] input.st [input2.st...]

```
Options:
-o, --output     The output directory
-w, --watch      Watch file changes
-v, --version    Show the version number
-h, --help       Show this message
```

The option `-o, --output` is used to specify out folder. Any file inputs will be
placed in the destination folder flatly. And directory inputs will keep the sub
directory structure.

#### examples
- Compile a directory tree of `.sleet` files in `src` into a parallel tree of
`.html` files in `dest`

```
$ sleet src/ -o dest/
```
- Watch for changes, and compile file every time it is saved

```
$ sleet src/ -o dest/ -w
```

## First Line Declaration

Sleet use first-line-declaration to determinate which sleet extension is used to compile
the current file, the extension of output file and the options that the sleet extension uses.

By default, it use sleet as its compiler, and the extension of output file is `html`
```
#!sleet html
```

To config it to use `sleet-handlebars` to compile it with extension and options

```
#!sleet-handlebars html block=layout,view inline=date,shortDate
```
or
```
#!handlebars html block=layout,view inline=date,shortDate
```

## Grammar
Sleet is indent based, it checks indent strictly. You can indent with any number
of `spaces` or a single `tab` character. But you have to keep consistent within
a given file.

```
doctype html
html
    head
        meta(charset='utf-8')
        title Welcom to Sleetjs
        link(rel='stylesheet' href='index.css')
        script(type='text/javascript') > uglify > coffee(bare=true).
            number = 2
            square = (x) -> x * x
            console.log square number
    body
        .container > p.
            This
            is
            a text block
        #footer
            p The end
```

compiles to:
```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8"/>
        <title>Welcom to Sleetjs</title>
        <link rel="stylesheet" href="index.css"/>
        <script type="text/javascript">
            var number,square;number=2,square=function(r){return r*r},console.log(square(number));
        </script>
    </head>
    <body>
        <div class="container"><p>
            This
            is
            a text block
        </p></div>
        <div id="footer">
            <p>The end</p>
        </div>
    </body>
</html>
```

### Tag
The first character of a tag name can be `[a-zA-Z$@_]` and the rest can be
`[a-zA-Z0-9$_-]`.

```
html
    @at1
    $dollar2
    _underscore3
```

compiles to
```html
<html>
    <@at1></@at1>
    <$dollar2></$dollar2>
    <_underscore3></_underscore3>
</html>
```

Tag name, class literal, id literal are all optional. But you should specify one
of these at least.

```
#id
    .class
    #id2.class2
    .class3#id3.class4
    a#id3.class5
```
compiles to
```html
<div id="id">
    <div class="class"></div>
    <div id="id2" class="class2"></div>
    <div id="id3" class="class3 class4"></div>
    <a id="id3" class="class5"></a>
</div>
```

### Inline Tag
Inline tag could save indents. There are two types of inline tag: inline child(>) and inline sibling(+).

```
.container
    div > #id > p text
    #a1 + #a2
    div > #a1 + #a2
```
compiles to
```html
<div class="container">
    <div><div id="id"><p>text</p></div></div>
    <div id="a1"></div><div id="a2"></div>
    <div><div id="a1"></div><div id="a2"></div></div>
</div>
```

### Attribute
A tag can have multiple attribute groups.

```
a.btn(href="#index")(class='btn-default') btn
```
compiles to
```html
<a class="btn btn-default" href="#index">btn</a>
```

If attribute value only contains `[a-zA-Z0-9$@_-]`, the quotes are optional.

```
a.btn(href="#index")(class=btn-default target=_blank) btn
```
compiles to
```html
<a class="btn btn-default" href="#index" target="_blank">btn</a>
```

Attribute groups could have multiple lines, each line present only one
attribute. And quotes are optional.

```
a#btn(
    href = #index
    class = btn btn-default and-something-else
)(target=_blank) btn
```
compiles to
```html
<a id="btn" href="#index" class="btn btn-default and-something-else" target="_blank">btn</a>
```



__Each attribute group could have an attribute predict. But by default the
predicts are all ignored. It just for extension.__
For example, if you use `Handlebars` as template engine:

```
a(class=active)&if(data) text
```
could be compiled to
```html
<a {{#if data}}class="active"{{/if}}>text</a>
```

or if you use `underscore` like template engine, it could be compiled to
```html
<a <% if (data) { %>class="active"<% } %>>text</a>
```

### Text
Inline text

```
p these are text
```
compiles to
```html
<p>these are text</p>
```

Text block, a dot immediately after tag

```
p.
    the indent of
        text block must
      equal or greater than parent's indent + 1
```
compiles to
```html
<p>
    the indent of
        text block must
      equal or greater than parent's indent + 1
</p>

```

Pipeline text and pipeline text block

```
p
    | pipeline
    | text
    | multiple lines
    .child-of-p
    a
        |.
            pipeline
                text block
        .child-of-a
```
compiles to
```html
<p>
    pipeline
    text
    multiple lines
    <div class="child-of-p"></div>
    <a>
        pipeline
            text block
        <div class="child-of-a"></div>
    </a>
</p>
```

### Comment
Single line comment and comment block

```
# single line comment
.container
    #.
        multiple
        line
        comments
    .row
        .col-md-12 text
```
compiles to
```html
<!-- single line comment -->
<div class="container">
    <!--
        multiple
        line
        comments
    -->
    <div class="row">
        <div class="col-md-12">text</div>
    </div>
</div>
```

### IE Conditional Comments
There is a buildin tag `ieif` to support Internet Explorer conditional comment
```sleet
ieif('lt IE 8') > script(src=hello.js)
@ieif('gte IE 8')
    script(src=script.js)
```
compiles to
```html
<!--[if lt IE 8]><script src="hello.js"></script><![endif]-->
<!--[if gte IE 8]><!-->
    <script src="script.js"></script>
<!--<![endif]-->
```

### Buildin Tags
These tags are extended by default.

#### Self-closing Tags
All these tags are self-closing tag
```
'area', 'base', 'br', 'col', 'command'
'embed', 'hr', 'img', 'input', 'keygen'
'link', 'meta', 'param', 'source', 'track', 'wbr'
```

#### Doctype
doctype(html)
```
<!DOCTYPE html>
```
doctype(xml)
```
<?xml version="1.0" encoding="utf-8" ?>
```
doctype(transitional)
```
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
```
doctype(strict)
```
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
```
doctype(frameset)
```
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
```
doctype(1.1)
```
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
```
doctype(basic)
```
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd">
```
doctype(mobile)
```
<!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.2//EN" "http://www.openmobilealliance.org/tech/DTD/xhtml-mobile12.dtd">
```

#### @include
@include is to include another sleet file into current file.

```
# a.sleet
.input-group
  span.input-group-addon @
  input.form-control(placeholder=Username)


# b.sleet
.panel.panel-default
    .panel-heading
        h3.panel-title Panel title
    .panel-body
        @include ./a.sleet
```
compiles to
```html
<div class="panel panel-default">
    <div class="panel-heading">
        <h3 class="panel-title">Panel title</h3>
    </div>
    <div class="panel-body">
        <div class="input-group">
            <span class="input-group-addon">@</span>
            <input class="form-control" placeholder="Username"/>
        </div>
    </div>
</div>
```

#### Transformers
Transformers are used to transform text content to another format.
`coffee`, `markdown`, `uglify` are supported by default. Make sure you
have the corresponding lib installed to use them. `coffee` needs `coffee-script`,
`markdown` needs `marked` and `uglify` needs `uglify-js`.

##### Coffee
```
script
    coffee.
        foods = ['broccoli', 'spinach', 'chocolate']
        eat food for food in foods when food isnt 'chocolate'
```
compiles to
```html
<script>
    (function() {
      var food, foods, _i, _len;

      foods = ['broccoli', 'spinach', 'chocolate'];

      for (_i = 0, _len = foods.length; _i < _len; _i++) {
        food = foods[_i];
        if (food !== 'chocolate') {
          eat(food);
        }
      }

    }).call(this);
</script>
```

##### Uglify
```
script
    uglify.
        (function() {
          var food, foods, _i, _len;

          foods = ['broccoli', 'spinach', 'chocolate'];

          for (_i = 0, _len = foods.length; _i < _len; _i++) {
            food = foods[_i];
            if (food !== 'chocolate') {
              eat(food);
            }
          }

        }).call(this);
```
compiles to
```html
<script>
    (function(){var c,o,a,l;for(o=["broccoli","spinach","chocolate"],a=0,l=o.length;l>a;a++)c=o[a],"chocolate"!==c&&eat(c)}).call(this);
</script>
```

or you can combine them
```
script > uglify > coffee.
    foods = ['broccoli', 'spinach', 'chocolate']
    eat food for food in foods when food isnt 'chocolate'
```
compiles to
```html
<script>
    (function(){var c,o,a,l;for(o=["broccoli","spinach","chocolate"],a=0,l=o.length;l>a;a++)c=o[a],"chocolate"!==c&&eat(c)}).call(this);
</script>
```

##### Markdown
```
html > body > markdown.
    # Sleetjs
    Sleetjs is a litte indent-based language that compiles into HTML/XML.
```
compiles to
```html
<html><body>
    <h1 id="sleetjs">Sleetjs</h1>
    <p>Sleetjs is a litte indent-based language that compiles into HTML/XML.</p>
</body></html>
```

## API
to be continued

## License
MIT
