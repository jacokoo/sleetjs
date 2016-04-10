'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DoctypeCompiler = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tag = require('./tag');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TYPES = {
    html: '<!DOCTYPE html>',
    xml: '<?xml version="1.0" encoding="utf-8" ?>',
    transitional: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"' + ' "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
    strict: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" ' + '"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">',
    frameset: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" ' + '"http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">',
    1.1: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" ' + '"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">',
    basic: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" ' + '"http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd">',
    mobile: '<!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.2//EN" ' + '"http://www.openmobilealliance.org/tech/DTD/xhtml-mobile12.dtd">'
};

var DoctypeCompiler = exports.DoctypeCompiler = function (_TagCompiler) {
    _inherits(DoctypeCompiler, _TagCompiler);

    function DoctypeCompiler() {
        _classCallCheck(this, DoctypeCompiler);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(DoctypeCompiler).apply(this, arguments));
    }

    _createClass(DoctypeCompiler, [{
        key: 'compile',
        value: function compile(context, tag) {
            var type = 'html';
            this.startIndent(context, tag);
            if (tag.attributeGroups && tag.attributeGroups.length > 0) {
                var value = tag.attributeGroups[0].attributes[0].value[0];
                if (value.minor === 'quoted') {
                    context.push('<!DOCTYPE ' + value.value + '>');
                    return;
                }
                type = value.value;
            }
            context.push(TYPES[type]);
        }
    }]);

    return DoctypeCompiler;
}(_tag.TagCompiler);