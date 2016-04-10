import { TagCompiler } from './tag';
import { parse } from '../parser';
import { Tag } from '../ast/tag';
import { Declaration } from '../ast/declaration';
import { Attribute } from '../ast/attribute';

import * as fs from 'fs';
import * as path from 'path';

export class IncludeCompiler extends TagCompiler {
    compile (context, tag) {
        const ctx = context;
        let file = tag.attributeGroups[0].attributes[0].value[0].value;
        let dir = ctx.options.filename || path.resolve('.');
        if (fs.statSync(dir).isFile()) dir = path.dirname(dir);
        file = path.resolve(dir, file);

        const code = fs.readFileSync(file, 'utf8');
        const { nodes } = parse(code, { Tag, Declaration, Attribute });

        nodes.forEach(node => ctx.sub(node, -1));

        ctx.compileChildren();
        ctx.parent.containsIndent = ctx.containsIndent;
    }
}
