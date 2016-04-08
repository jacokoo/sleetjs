export class SettingCompiler {
    compile (context, attribute, value) {
        const joiner = context.getCompiler(attribute).joiner;
        const name = attribute.name || value;
        let v = context.getNote(name) || '';
        if (v) v = v + joiner;
        context.setNote(name, `${v}${value || name}`);
    }
}
