"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GroupCompiler = exports.GroupCompiler = function () {
    function GroupCompiler() {
        _classCallCheck(this, GroupCompiler);
    }

    _createClass(GroupCompiler, [{
        key: "compile",
        value: function compile(context, group, tag, note) {
            if (group.setting) {
                context.getCompiler(group.setting).compile(context, group, tag, note);
                return;
            }
            group.attributes.forEach(function (attr) {
                context.getCompiler(attr).compile(context, attr, group, tag, note);
            });
        }
    }]);

    return GroupCompiler;
}();