export class AttributeCompiler {
    constructor (joiner = '') {
        this._joiner = joiner;
    }

    compile (context, attribute, group, tag) {
        let value = this.getValue(context, attribute.value, attribute, group, tag);
        if (group.setting) {
            const settingCompiler = context.getCompiler(group.setting);
            settingCompiler.compile(context, attribute, value, group, tag);
            return;
        }

        let name = attribute.name;
        if (!name) name = value;
        if (context.getNote(name)) value = context.getNote(name) + this.joiner + value;
        context.setNote(name, value);
    }

    get joiner () { return this._joiner; }

    getValue (context, value, attribute, group, tag) {
        if (!value) return null;
        return value.map(v => context.getCompiler(v).compile(context, v, attribute, group, tag)).join(this.joiner);
    }
}
