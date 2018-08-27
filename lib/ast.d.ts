import { Location } from './sleet';
export declare enum NodeType {
    Declaration = 0,
    Tag = 1,
    TagExtra = 2,
    AttributeGroup = 3,
    Attribute = 4,
    Setting = 5,
    StringValue = 6,
    BooleanValue = 7,
    NumberValue = 8,
    NullValue = 9,
    IdentifierValue = 10,
    CompareOperator = 11,
    Transformer = 12,
    TransformValue = 13,
    Helper = 14,
    HelperAttribute = 15,
    StaticText = 16,
    DynamicText = 17
}
export declare class SleetNode {
    protected _location: Location;
    private _type;
    constructor(type: NodeType, location: Location);
    readonly type: NodeType;
    readonly location: Location;
}
declare class NamedParentNode<T> extends SleetNode {
    private _name;
    constructor(name: T, type: NodeType, location: Location);
    readonly name: T;
}
declare class NamedNode extends NamedParentNode<string> {
}
declare class NullableNamedNode extends NamedParentNode<string | undefined> {
}
export declare class SleetValue<T> extends SleetNode {
    protected _value: T;
    constructor(value: T, type: NodeType, location: Location);
    readonly value: T;
    toHTMLString(): string;
}
export declare class StringValue extends SleetValue<string> {
    constructor(value: string, location: Location);
    toHTMLString(): string;
}
export declare class BooleanValue extends SleetValue<boolean> {
    constructor(value: boolean, location: Location);
}
export declare class NumberValue extends SleetValue<number> {
    constructor(value: number, location: Location);
}
export declare class NullValue extends SleetValue<null> {
    constructor(location: Location);
}
export declare class IdentifierValue extends SleetValue<string> {
    constructor(value: string, location: Location);
}
export declare type NormalValue = NumberValue | BooleanValue | StringValue | NullValue | IdentifierValue;
export declare type CompareOperator = '==' | '>=' | '<=' | '>' | '<' | '!=';
export declare class CompareOperatorValue extends SleetValue<CompareOperator> {
    constructor(value: CompareOperator, location: Location);
}
export declare class Transformer extends NamedNode {
    private _params;
    constructor(name: string, params: NormalValue[], location: Location);
    readonly params: NormalValue[];
    toHTMLString(): string;
}
export declare class TransformValue extends SleetValue<NormalValue> {
    private _transformers;
    constructor(value: NormalValue, transformers: (Transformer | NormalValue)[], location: Location);
    readonly transformers: (StringValue | BooleanValue | NumberValue | NullValue | IdentifierValue | Transformer)[];
    toHTMLString(): string;
}
export declare type HelperValue = NormalValue | CompareOperatorValue | TransformValue;
export declare class HelperAttribute extends NullableNamedNode {
    private _value;
    constructor(name: string | undefined, value: HelperValue, location: Location);
    readonly value: HelperValue;
    toHTMLString(): string;
}
export declare class Helper extends NullableNamedNode {
    private _attributes;
    constructor(name: string | undefined, attributes: HelperAttribute[], location: Location);
    readonly attributes: HelperAttribute[];
    toHTMLString(): string;
}
export declare class StaticText extends SleetValue<string> {
    constructor(value: string, location: Location);
    _merge(text: StaticText): void;
    toHTMLString(): string;
}
export declare type DynamicTextValue = IdentifierValue | Helper;
export declare class DynamicText extends SleetValue<DynamicTextValue> {
    constructor(value: DynamicTextValue, location: Location);
    toHTMLString(): string;
}
export declare type SleetText = StaticText | DynamicText;
export declare type SleetTextLine = SleetText[];
export declare type AttributeValue = NormalValue | Helper;
export declare class Attribute extends NullableNamedNode {
    private _values;
    private _namespace?;
    constructor(ns: string | undefined, name: string | undefined, values: AttributeValue[], location: Location);
    readonly values: AttributeValue[];
    readonly namespace: string | undefined;
    merge(other: Attribute): boolean;
}
export declare class Setting extends NamedNode {
    private _attributes;
    constructor(name: string, attributes: Attribute[], location: Location);
    readonly attributes: Attribute[];
}
export declare class AttributeGroup extends SleetNode {
    private _setting?;
    private _attributes;
    constructor(attributes: Attribute[], setting: Setting | undefined, location: Location);
    readonly attributes: Attribute[];
    readonly setting: Setting | undefined;
    _setAttributes(source: Attribute[]): void;
    merge(other: AttributeGroup, ignoreSetting?: boolean): boolean;
}
export declare type ExtraValue = NormalValue | CompareOperatorValue;
export declare class TagExtra extends NamedNode {
    private _values;
    constructor(name: string, values: ExtraValue[], location: Location);
    readonly values: ExtraValue[];
}
export declare class Tag extends NullableNamedNode {
    private _namespace?;
    private _dots;
    private _hash?;
    private _indent;
    private _children;
    private _attributeGroups;
    private _extra?;
    private _parent?;
    private _text;
    constructor(indent: number, name: string | undefined, ns: string, dots: string[], hash: string | undefined, groups: AttributeGroup[], extra: TagExtra, location: Location);
    readonly indent: number;
    readonly dots: string[];
    readonly hash: string | undefined;
    readonly namespace: string | undefined;
    readonly children: Tag[];
    readonly attributeGroups: AttributeGroup[];
    readonly extra: TagExtra | undefined;
    readonly parent: Tag | undefined;
    readonly text: SleetText[][];
    _setChildren(children: Tag[]): void;
    _setText(text: SleetTextLine[]): void;
    private _setGroup;
}
export declare class Declaration extends NamedNode {
    private _options;
    private _extension;
    constructor(name: string, ext: string, pair: {
        key: string;
        value: string;
    }[], location: Location);
    readonly extension: string;
    option(key: string): string;
}
export {};
