import { Compiler, Context } from '../../context'
import { NodeType, SleetNode, SleetValue, StringValue, BooleanValue, NumberValue, IdentifierValue } from '../../ast'

abstract class ValueCompiler<T extends SleetValue<any>> implements Compiler {
    private value: T
    constructor (value: T) {
        this.value = value
    }

    compile (context: Context) {
        context.push(this.value.value)
    }
}

export class StringValueCompiler extends ValueCompiler<StringValue> {
    static type = NodeType.StringValue
    static create (node: SleetNode, stack: SleetNode[]): Compiler | undefined {
        return new StringValueCompiler(node as StringValue)
    }
}

export class BooleanValueCompiler extends ValueCompiler<BooleanValue> {
    static type = NodeType.BooleanValue
    static create (node: SleetNode, stack: SleetNode[]): Compiler | undefined {
        return new BooleanValueCompiler(node as BooleanValue)
    }
}

export class NumberValueCompiler extends ValueCompiler<NumberValue> {
    static type = NodeType.NumberValue
    static create (node: SleetNode, stack: SleetNode[]): Compiler | undefined {
        return new NumberValueCompiler(node as NumberValue)
    }
}

export class IdentifierValueCompiler extends ValueCompiler<IdentifierValue> {
    static type = NodeType.IdentifierValue
    static create (node: SleetNode, stack: SleetNode[]): Compiler | undefined {
        return new IdentifierValueCompiler(node as IdentifierValue)
    }
}
