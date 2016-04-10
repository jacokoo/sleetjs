import * as parser from './parser';
import { Tag } from './ast/tag';
import { Declaration } from './ast/declaration';
import { Attribute } from './ast/attribute';

import { Context } from './context';

export function compile (input, options = {}) {
    try {
        const result = parser.parse(input, { Tag, Declaration, Attribute });
        const context = new Context(options, result.nodes, options.indentToken || result.indent);
        let extension = null;

        if (result.declaration) {
            const { name } = result.declaration;
            extension = result.declaration.extension;

            if (options[name] && options[name].overrideContext) {
                options[name].overrideContext(context, options, result.declaration);
            } else if (name.slice(0, 6) === 'sleet-') {
                const mod = require(name);
                mod.overrideContext(context, options, result.declaration);
                extension || (extension = mod.getDefaultExtension());
            } else if (name !== 'sleet') {
                const mod = require(`sleet-${name}`);
                mod.overrideContext(context, options, result.declaration);
                extension || (extension = mod.getDefaultExtension());
            }
        }

        context.doCompile();
        return { content: context.getOutput(), extension: extension || options.extension || 'html' };
    } catch (e) {
        if (e instanceof parser.SyntaxError) {
            throw new Error(`${e.message} [line: ${e.line}, column: ${e.column}]`);
        } else {
            throw e;
        }
    }
}
