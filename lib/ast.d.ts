export interface Location {
    start: {
        offset: number;
        line: number;
        column: number;
    };
    end: {
        offset: number;
        line: number;
        column: number;
    };
}
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
declare class SleetValue<T> extends SleetNode {
    protected _value: T;
    constructor(value: T, type: NodeType, location: Location);
    readonly value: T;
}
export declare class StringValue extends SleetValue<string> {
    constructor(value: string, location: Location);
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
}
export declare class TransformValue extends SleetValue<NormalValue> {
    private _transformers;
    constructor(value: NormalValue, transformers: (Transformer | NormalValue)[], location: Location);
    readonly transformers: (StringValue | BooleanValue | NumberValue | NullValue | IdentifierValue | Transformer)[];
}
export declare type HelperValue = NormalValue | CompareOperatorValue | TransformValue;
export declare class HelperAttribute extends NullableNamedNode {
    private _value;
    constructor(name: string, value: HelperValue, location: Location);
    readonly value: HelperValue;
}
export declare class Helper extends NullableNamedNode {
    private _attributes;
    constructor(name: string, attributes: HelperAttribute[], location: Location);
    readonly attributes: HelperAttribute[];
}
export declare class StaticText extends SleetValue<string> {
    constructor(value: string, location: Location);
    _merge(text: StaticText): void;
}
export declare type DynamicTextValue = IdentifierValue | Helper;
export declare class DynamicText extends SleetValue<DynamicTextValue> {
    constructor(value: DynamicTextValue, location: Location);
}
export declare type SleetText = StaticText | DynamicText;
export declare type AttributeValue = NormalValue | Helper;
export declare class Attribute extends NullableNamedNode {
    private _values;
    private _namespace?;
    constructor(ns: string, name: string, values: AttributeValue[], location: Location);
    readonly values: AttributeValue[];
    readonly namespace: string | undefined;
}
export declare class Setting extends NamedNode {
    private _attributes;
    constructor(name: string, attributes: Attribute[], location: Location);
    readonly attributes: Attribute[];
}
export declare class AttributeGroup extends SleetNode {
    private _setting?;
    private _attributes;
    constructor(attributes: Attribute[], setting: Setting, location: Location);
    readonly attributes: Attribute[];
    readonly setting: Setting | undefined;
    _merge(other: AttributeGroup): boolean;
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
    constructor(indent: number, name: string, ns: string, dots: string[], hash: string, groups: AttributeGroup[], extra: TagExtra, location: Location);
    readonly indent: number;
    readonly dots: string[];
    readonly hash: string | undefined;
    readonly namespace: string | undefined;
    readonly children: Tag[];
    readonly attributeGroups: AttributeGroup[];
    readonly extra: TagExtra | undefined;
    readonly parent: Tag | undefined;
    readonly text: SleetText[];
    _setChildren(children: Tag[]): void;
    _setText(text: SleetText[]): void;
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
    option(key: any): string;
}
export interface CompileResult {
    nodes: Tag[];
    indent: string;
    declaration: Declaration;
}
export {};
