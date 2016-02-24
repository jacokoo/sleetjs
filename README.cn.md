```
   _____ _           _          _
  / ____| |         | |        | |
 | (___ | | ___  ___| |_       | |___
  \___ \| |/ _ \/ _ \ __|  _   | / __|
  ____) | |  __/  __/ |_  | |__| \__ \
 |_____/|_|\___|\___|\__|  \____/|___/
```

# Sleetjs
Sleetjs 是一种把代码编译成 HTML/XML 的语言

它不是一个模板引擎(像Jade那样), 所以它不能渲染数据.
但是你可以扩展一些标记(Tag), 使的编译出来的HTML中包含一些模板引擎需要的标记(如: {{#if}} <% if %>等),
使的它可以用模板引擎来渲染数据.

[在线试玩](http://jacokoo.github.io/sleetjs)

## 相关资源
* [Sleet-Handlebars](https://github.com/JacoKoo/sleet-handlebars) Sleet 的一个扩展，
  用于把 Sleet 代码编译成 Handlebars 模板
* [Atom-Sleet](https://github.com/JacoKoo/atom-sleet) Sleet 与 Sleet-Handlebars 在
  [Atom](https://atom.io) 编辑器里的插件(包括语法高亮、保存时编译、预览等功能)
* [Handlebars-Sleet](https://github.com/JacoKoo/handlebars-sleet) 用于把已有的
  HTML/HBS(Handlebars 模板) 转换成 Sleet 文件

## 截图
![Screenshot](https://raw.githubusercontent.com/JacoKoo/atom-sleet/master/screenshot.jpg)

## 安装
安装前请确认你已经安装了 `npm`

```
$ npm install -g sleet
```

## 命令行用法

```
$ sleet [options] input1 [input2...]
```

Sleet 命令把输入方法编译成 html/xml 文件, 它可以同时处理多个输入文件或目录.
当指定目录时, 它会扫描指定目录与指定目录的所有子孙目录, 找出所有以 `.sleet`为扩展名的文件,
并编译它们.

```
$ sleet -h
/usr/local/bin/sleet [options] input.st [input2.st...]


Options:
-o, --output     The output directory
-w, --watch      Watch file changes
-v, --version    Show the version number
-h, --help       Show this message
```

`-o, --output` 用来指定输出目录. 所有的输入文件都会把编译后的文件放到相应的输出目录中.

#### 使用举例
- 把 `src` 目录中的所有 `.sleet` 文件编译到 `dest` 目录的相对应的位置

        $ sleet src/ -o dest/

- 监视 `src` 目录中的文件, 如果有修改的话, 就把修改过的文件编译到 `dest` 目录的对应位置

        $ sleet src/ -o dest/ -w

## 首行声明

Sleet 可以用首行声明的方式来确定用哪个Sleet扩展来编译当前文件、输出文件的后缀名以及编译
时用到的参数

默认情况下，使用sleet来编译，后缀名为`html`
```
#!sleet html
```

如果要配置用`sleet-handlebars`来编译，且指定后缀名与参数，可以按如下配置
```
#!sleet-handlebars html block=layout,view inline=date,shortDate
```
or
```
#!handlebars html block=layout,view inline=date,shortDate
```

## 语法
Sleet 是严格基于缩进的语言. 缩进相等的相邻标记为兄弟标记，缩进大的的标记是缩进小的标记的子孙标记.

一个缩进可以是任意多个空格或者一个tab符, 唯一的规则是, 你的所有缩进都要跟你一个缩进一样.

例如你的第一个缩进是4个空格, 那接下来所有的缩进都应该是4个空格的倍数, 否则会编译错误.


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

会编译为:
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

### 标记(Tag)
标记名的第一个字符可以是: `[a-zA-Z$@_]`, 后面的字符可以为: `[a-zA-Z0-9$_-]`.

例如:
```
html
    @at1
    $dollar2
    _underscore3
```
会编译为:
```html
<html>
    <@at1></@at1>
    <$dollar2></$dollar2>
    <_underscore3></_underscore3>
</html>
```

标记名、类选择器、ID选择器都是可选的，但至少要提供其中一个。

```
#id
    .class
    #id2.class2
    .class3#id3.class4
    a#id3.class5
```
会编译为：
```html
<div id="id">
    <div class="class"></div>
    <div id="id2" class="class2"></div>
    <div id="id3" class="class3 class4"></div>
    <a id="id3" class="class5"></a>
</div>
```

### 行内标记(Inline Tag)
用行内标记可以节省缩进。

有两种行内标记，分别是：行内子标记(>)、行内兄弟标记(+)


```
.container
    div > #id > p text
    #a1 + #a2
    div > #a1 + #a2
```
会编译为:
```html
<div class="container">
    <div><div id="id"><p>text</p></div></div>
    <div id="a1"></div><div id="a2"></div>
    <div><div id="a1"></div><div id="a2"></div></div>
</div>
```

### 属性
一个标记可以有多个属性组

```
a.btn(href="#index")(class='btn-default') btn
```
会编译为：
```html
<a class="btn btn-default" href="#index">btn</a>
```

如果属性值只包含：`[a-zA-Z0-9$@_-]`, 那么引号是可以省略的

```
a.btn(href="#index")(class=btn-default target=_blank) btn
```
会编译为:
```html
<a class="btn btn-default" href="#index" target="_blank">btn</a>
```

属性组可以包含多行，每一行代表一个属性，属性值的引号是可选的

```
a#btn(
    href = #index
    class = btn btn-default and-something-else
)(target=_blank) btn
```
会编译为:
```html
<a id="btn" href="#index" class="btn btn-default and-something-else" target="_blank">btn</a>
```



__每一个属性组可以跟一个限定符，但默认实现中，这些限定符都被省略了。这个机制是给扩展用的__

例如，如果你用`Handlebars`模板引擎的话，可以这么用：

```
a(class=active)&if(data) text
```
可以被编译为：
```html
<a {{#if data}}class="active"{{/if}}>text</a>
```

而如果你用`underscore`的话，它可以被编译成:
```html
<a <% if (data) { %>class="active"<% } %>>text</a>
```

### 文本
行内文本

```
p these are text
```
编译为：
```html
<p>these are text</p>
```

文本块，标记后面直接跟一个英文句号：

```
p.
    the indent of
        text block must
      equal or greater than parent's indent + 1
```
编译为：
```html
<p>
    the indent of
        text block must
      equal or greater than parent's indent + 1
</p>

```

管道(pipeline)文本与管道文本块：

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
会编译成：
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

### 注释
单行注释与多行注释

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
会编译为:
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
在 Sleet 中，有一个内置标记 `ieif` 可以用来写 IE条件注释：

```sleet
ieif('lt IE 8') > script(src=hello.js)
@ieif('gte IE 8')
    script(src=script.js)
```
编译为:
```html
<!--[if lt IE 8]><script src="hello.js"></script><![endif]-->
<!--[if gte IE 8]><!-->
    <script src="script.js"></script>
<!--<![endif]-->
```

### 内置标记
这些内置标记被增强用来实现一些具体功能

#### 自关闭标记(Self-closing)
以下这些都是自关闭标记
```
'area', 'base', 'br', 'col', 'command'
'embed', 'hr', 'img', 'input', 'keygen'
'link', 'meta', 'param', 'source', 'track', 'wbr'
```

#### 文档类型(Doctype)
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
@include 用来把另一个 sleet 文件引入到当前文件

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
会编译为:
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

#### 转换器(Transformers)
转换器用来把内容转换为相应的格式。内置支持的转换器有：`coffee`, 'markdown', 'uglify'.

##### Coffee
用来把 `coffee script` 编译为 `javascript` 代码

```
script
    coffee.
        foods = ['broccoli', 'spinach', 'chocolate']
        eat food for food in foods when food isnt 'chocolate'
```
会编译为:
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
编译为:
```html
<script>
    (function(){var c,o,a,l;for(o=["broccoli","spinach","chocolate"],a=0,l=o.length;l>a;a++)c=o[a],"chocolate"!==c&&eat(c)}).call(this);
</script>
```

你可以把它他组合起来使用:
```
script > uglify > coffee.
    foods = ['broccoli', 'spinach', 'chocolate']
    eat food for food in foods when food isnt 'chocolate'
```
编译为：
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
编译为：
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
