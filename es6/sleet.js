import * as parser from './parser';
import { Tag } from './ast/tag';
import { Declaration } from './ast/declaration';
import { Attribute } from './ast/attribute';

import { Context } from './context';

export function compile (input, options = {}) {
    try {
        const result = parser.parse(input, { Tag, Declaration, Attribute });
        const context = new Context(options, result.nodes, result.indent);
        context.doCompile();
        return context.getOutput();
    } catch (e) {
        if (e instanceof parser.SyntaxError) {
            throw new Error(`${e.message} [line: ${e.line}, column: ${e.column}]`);
        } else {
            throw e;
        }
    }
}
