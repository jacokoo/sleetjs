interface Location {
    start: {offset: number, line: number, column: number}
    end: {offset: number, line: number, column: number}
}

enum NodeType {
    Declare, Tag, AttributeGroup, Attribute, Text, Helper, Setting,
    StringValue, BooleanValue, NumberValue, NullValue, IdentifierValue, CompareOperator,
    Transformer, TransformValue
}

class SleetNode {
    location: Location
    type: NodeType

    constructor(type: NodeType, location: Location) {
        this.type = type
        this.location = location
    }
}

class NamedNode extends SleetNode {
    private _name: string

    constructor (name: string, type: NodeType, location: Location) {
        super(type, location)
        this._name = name
    }

    get name () {
        return this._name
    }
}

class NullableNamedNode extends NamedNode {
    get name (): string | null {
        return super.name
    }
}

class SleetValue<T> extends SleetNode {
    private _value: T

    constructor(value: T, type: NodeType, location: Location) {
        super(type, location)
        this._value = value
    }

    get value () {
        return this._value
    }
}

class StringValue extends SleetValue<string> {
    constructor(value: string, location: Location) {
        super(value, NodeType.StringValue, location)
    }
}

class BooleanValue extends SleetValue<boolean> {
    constructor(value: boolean, location: Location) {
        super(value, NodeType.BooleanValue, location)
    }
}

class NumberValue extends SleetValue<number> {
    constructor(value: number, location: Location) {
        super(value, NodeType.NumberValue, location)
    }
}

class NullValue extends SleetValue<void> {
    constructor(location: Location) {
        super(null, NodeType.NullValue, location)
    }
}

class IdentifierValue extends SleetValue<string> {
    constructor(value: string, location: Location) {
        super(value, NodeType.IdentifierValue, location)
    }
}

type NormalValue = NumberValue | BooleanValue | StringValue | NullValue | IdentifierValue

type CompareOperator = '==' | '>=' | '<=' | '>' | '<' | '!='
class CompareOperatorValue extends SleetValue<CompareOperator> {
    constructor(value: CompareOperator, location: Location) {
        super(value, NodeType.CompareOperator, location)
    }
}

// name is not nullable
class Transformer extends NamedNode {
    private _params: NormalValue[]

    constructor(name: string, params: NormalValue[], location: Location) {
        super(name, NodeType.Transformer, location)
        this._params = params || []
    }

    get params () {
        return this._params
    }
}

class TransformValue extends SleetValue<NormalValue> {
    private _items: (Transformer | NormalValue)[]

    constructor(value: NormalValue, items: (Transformer | NormalValue)[], location: Location) {
        super(value, NodeType.TransformValue, location)
        this._items = items || []
    }

    get items () {
        return this._items
    }
}

// name could be null
class Helper extends NullableNamedNode {

}
