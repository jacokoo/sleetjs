import { CompileResult } from '../ast'
import * as ast from '../ast'
import * as parser from './syntax'

export function parse(input: string): CompileResult {
    return parser.parse(input, {ast})
}
