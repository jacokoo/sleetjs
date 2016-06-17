export class AttributeCompiler {
    constructor (joiner = '', booleanAttribute) {
        this._joiner = joiner;
        this._booleanAttribute = booleanAttribute;
    }

    compile (context, attribute, group, tag) {
        if (this._booleanAttribute) {
            context.push(` ${attribute.name}`);
            return;
        }

        context.push(' ');
        this.generateName(context, attribute, group, tag);
        context.push('="');
        this.generateValue(context, attribute, group, tag);
        context.push('"');
    }

    generateName (context, attribute, group, tag) {
        if (attribute.name) {
            context.push(attribute.name);
            return;
        }
        this.generateValue(context, attribute, group, tag);
    }

    generateValue (context, attribute, group, tag) {
        attribute.value.forEach(v => {
            context.push(context.getCompiler(v).compile(context, v, attribute, group, tag));
            context.push(this.joiner);
        });
        context.pop();
    }

    get joiner () { return this._joiner; }

    getValue (context, value, attribute, group, tag) {
        if (!value) return null;
        return value.map(v => context.getCompiler(v).compile(context, v, attribute, group, tag)).join(this.joiner);
    }
}
