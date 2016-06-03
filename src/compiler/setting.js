export class SettingCompiler {
    compile (context, group, tag, note) {
        group.attributes.forEach((attr) => {
            context.getCompiler(attr).compile(context, attr, group, tag, note);
        });
    }
}
