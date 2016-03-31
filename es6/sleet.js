import * as parser from './parser';
import {Tag} from './ast/tag';
import {Declaration} from './ast/declaration';
import {Attribute} from './ast/attribute';

export function compile(input, options = {}) {
    try {
        const result = parser.parse(input, {
            Tag: Tag,
            Declaration: Declaration,
            Attribute: Attribute
        });
        return result;
    } catch (e) {
        if (e instanceof parser.SyntaxError) {
            throw new Error(`${e.message} [line: ${e.line}, column: ${e.column}]`);
        } else {
            throw e;
        }
    }

};
