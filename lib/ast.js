"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NodeType;
(function (NodeType) {
    NodeType[NodeType["Declaration"] = 0] = "Declaration";
    NodeType[NodeType["Tag"] = 1] = "Tag";
    NodeType[NodeType["TagExtra"] = 2] = "TagExtra";
    NodeType[NodeType["AttributeGroup"] = 3] = "AttributeGroup";
    NodeType[NodeType["Attribute"] = 4] = "Attribute";
    NodeType[NodeType["Setting"] = 5] = "Setting";
    NodeType[NodeType["StringValue"] = 6] = "StringValue";
    NodeType[NodeType["BooleanValue"] = 7] = "BooleanValue";
    NodeType[NodeType["NumberValue"] = 8] = "NumberValue";
    NodeType[NodeType["NullValue"] = 9] = "NullValue";
    NodeType[NodeType["IdentifierValue"] = 10] = "IdentifierValue";
    NodeType[NodeType["CompareOperator"] = 11] = "CompareOperator";
    NodeType[NodeType["Transformer"] = 12] = "Transformer";
    NodeType[NodeType["TransformValue"] = 13] = "TransformValue";
    NodeType[NodeType["Helper"] = 14] = "Helper";
    NodeType[NodeType["HelperAttribute"] = 15] = "HelperAttribute";
    NodeType[NodeType["StaticText"] = 16] = "StaticText";
    NodeType[NodeType["DynamicText"] = 17] = "DynamicText";
})(NodeType = exports.NodeType || (exports.NodeType = {}));
class SleetNode {
    constructor(type, location) {
        this._type = type;
        this._location = location;
    }
    get type() {
        return this._type;
    }
    get location() {
        return this._location;
    }
}
exports.SleetNode = SleetNode;
class NamedParentNode extends SleetNode {
    constructor(name, type, location) {
        super(type, location);
        this._name = name;
    }
    get name() {
        return this._name;
    }
}
class NamedNode extends NamedParentNode {
}
class NullableNamedNode extends NamedParentNode {
}
class SleetValue extends SleetNode {
    constructor(value, type, location) {
        super(type, location);
        this._value = value;
    }
    get value() {
        return this._value;
    }
}
class StringValue extends SleetValue {
    constructor(value, location) {
        super(value, NodeType.StringValue, location);
    }
}
exports.StringValue = StringValue;
class BooleanValue extends SleetValue {
    constructor(value, location) {
        super(value, NodeType.BooleanValue, location);
    }
}
exports.BooleanValue = BooleanValue;
class NumberValue extends SleetValue {
    constructor(value, location) {
        super(value, NodeType.NumberValue, location);
    }
}
exports.NumberValue = NumberValue;
class NullValue extends SleetValue {
    constructor(location) {
        super(null, NodeType.NullValue, location);
    }
}
exports.NullValue = NullValue;
class IdentifierValue extends SleetValue {
    constructor(value, location) {
        super(value, NodeType.IdentifierValue, location);
    }
}
exports.IdentifierValue = IdentifierValue;
class CompareOperatorValue extends SleetValue {
    constructor(value, location) {
        super(value, NodeType.CompareOperator, location);
    }
}
exports.CompareOperatorValue = CompareOperatorValue;
class Transformer extends NamedNode {
    constructor(name, params, location) {
        super(name, NodeType.Transformer, location);
        this._params = params || [];
    }
    get params() {
        return this._params;
    }
}
exports.Transformer = Transformer;
class TransformValue extends SleetValue {
    constructor(value, transformers, location) {
        super(value, NodeType.TransformValue, location);
        this._transformers = transformers || [];
    }
    get transformers() {
        return this._transformers;
    }
}
exports.TransformValue = TransformValue;
class HelperAttribute extends NullableNamedNode {
    constructor(name, value, location) {
        super(name, NodeType.HelperAttribute, location);
        this._value = value;
    }
    get value() {
        return this._value;
    }
}
exports.HelperAttribute = HelperAttribute;
class Helper extends NullableNamedNode {
    constructor(name, attributes, location) {
        super(name, NodeType.Helper, location);
        this._attributes = attributes || [];
    }
    get attributes() {
        return this._attributes;
    }
}
exports.Helper = Helper;
class StaticText extends SleetValue {
    constructor(value, location) {
        super(value, NodeType.StaticText, location);
    }
    _merge(text) {
        const o = { start: this._location.start, end: text._location.end };
        this._value += text._value;
        this._location = o;
    }
}
exports.StaticText = StaticText;
class DynamicText extends SleetValue {
    constructor(value, location) {
        super(value, NodeType.DynamicText, location);
    }
}
exports.DynamicText = DynamicText;
class Attribute extends NullableNamedNode {
    constructor(ns, name, values, location) {
        super(name, NodeType.Attribute, location);
        this._values = values || [];
        this._namespace = ns;
    }
    get values() {
        return this._values;
    }
    get namespace() {
        return this._namespace;
    }
}
exports.Attribute = Attribute;
class Setting extends NamedNode {
    constructor(name, attributes, location) {
        super(name, NodeType.Setting, location);
        this._attributes = attributes || [];
    }
    get attributes() {
        return this._attributes;
    }
}
exports.Setting = Setting;
class AttributeGroup extends SleetNode {
    constructor(attributes, setting, location) {
        super(NodeType.AttributeGroup, location);
        this._setting = setting;
        this._attributes = attributes || [];
    }
    get attributes() {
        return this._attributes;
    }
    get setting() {
        return this._setting;
    }
    _merge(other) {
        if (other._setting || this._setting)
            return false;
        const o = { start: this._location.start, end: other._location.end };
        this._attributes = this._attributes.concat(other._attributes);
        this._location = o;
        return true;
    }
}
exports.AttributeGroup = AttributeGroup;
class TagExtra extends NamedNode {
    constructor(name, values, location) {
        super(name, NodeType.TagExtra, location);
        this._values = values || [];
    }
    get values() {
        return this._values;
    }
}
exports.TagExtra = TagExtra;
class Tag extends NullableNamedNode {
    constructor(indent, name, ns, dots, hash, groups, extra, location) {
        super(name, NodeType.Tag, location);
        this._children = [];
        this._text = [];
        this._indent = indent;
        this._namespace = ns;
        this._dots = dots || [];
        this._hash = hash;
        this._extra = extra;
        this._setGroup(groups || []);
    }
    get indent() { return this._indent; }
    get dots() { return this._dots; }
    get hash() { return this._hash; }
    get namespace() { return this._namespace; }
    get children() { return this._children; }
    get attributeGroups() { return this._attributeGroups; }
    get extra() { return this._extra; }
    get parent() { return this._parent; }
    get text() { return this._text; }
    _setChildren(children) {
        this._children = children;
    }
    _setText(text) {
        this._text = (text || []).reduce((acc, item) => {
            if (!acc.length)
                return [item];
            if (item.type === NodeType.DynamicText)
                return acc.concat(item);
            const last = acc[acc.length - 1];
            if (item.type === NodeType.StaticText && last.type === NodeType.StaticText) {
                last._merge(item);
                return acc;
            }
            return acc.concat(item);
        }, []);
    }
    _setGroup(groups) {
        this._attributeGroups = groups.reduce((acc, item) => {
            if (!acc.length)
                return [item];
            if (acc[acc.length - 1]._merge(item))
                return acc;
            return acc.concat(item);
        }, []);
    }
}
exports.Tag = Tag;
class Declaration extends NamedNode {
    constructor(name, ext, pair, location) {
        super(name, NodeType.Declaration, location);
        this._options = {};
        this._extension = ext;
        pair.forEach(it => this._options[it.key] = it.value);
    }
    get extension() {
        return this._extension;
    }
    option(key) {
        return this._options[key];
    }
}
exports.Declaration = Declaration;
//# sourceMappingURL=ast.js.map