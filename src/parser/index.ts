import { CompileResult } from '../sleet'
import * as parser from './syntax'
import * as ast from '../ast'

export function parse(input: string): CompileResult {
    return parser.parse(input, {ast})
}
