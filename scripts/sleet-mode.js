define('ace/mode/sleet-highlight-rules', function(require, exports, module) {
    var oop = require('../lib/oop'),
        TextHighlightRules = require("./text_highlight_rules").TextHighlightRules,
        SleetHighlightRules, indentToken, getIndent, indent = 0;

    getIndent = function(value) {
        return value.match(/^(\s*)/)[1].length;
    };

    SleetHighlightRules = function() {
        this.$rules = {
            start: [{
                token: 'comment',
                regex: /^#!\s*(.*)$|^\s*# (.*)$/,
                next: 'start'
            }, {
                onMatch: function(value, current, stack) {
                    indent = getIndent(value);
                    return 'comment';
                },
                regex: /^(\s*)(?:#\.\s*)$/,
                next: 'comment-block'
            }],

            'comment-block': [{
                onMatch: function(value, current, stack) {
                    var i = getIndent(value);
                    console.log(value, i, indent, stack);
                    this.next = i > indent ? '' : 'start';
                    return 'comment';
                },
                regex: /^(\s*)(?:.*)$/
            }]
        };
    };

    oop.inherits(SleetHighlightRules, TextHighlightRules);
    exports.SleetHighlightRules = SleetHighlightRules;
});

define('ace/mode/sleet', function(require, exports) {
    var oop = require("../lib/oop"),
        TextMode = require("./text").Mode,
        rules = require('./sleet-highlight-rules').SleetHighlightRules, Mode;

    Mode = function() {
        this.HighlightRules = rules;
    };

    oop.inherits(Mode, TextMode);

    console.log('mode');

    exports.Mode = Mode;
});
