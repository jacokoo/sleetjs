export class AttributeCompiler {
    constructor (joiner = '', booleanAttribute) {
        this._joiner = joiner;
        this._booleanAttribute = booleanAttribute;
    }

    compile (context, attribute, group, tag, note) {
        let value = this.getValue(context, attribute.value, attribute, group, tag);
        let name = attribute.name;

        if (this._booleanAttribute) {
            name = name || value;
            note.set(name, null);
            return;
        }

        if (!name) name = value;
        if (note.get(name)) value = note.get(name) + this.joiner + value;
        note.set(name, value);
    }

    get joiner () { return this._joiner; }

    getValue (context, value, attribute, group, tag) {
        if (!value) return null;
        return value.map(v => context.getCompiler(v).compile(context, v, attribute, group, tag)).join(this.joiner);
    }
}
