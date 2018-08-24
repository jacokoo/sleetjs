export class SettingCompiler {
    compile (context, group, tag) {
        group.attributes.forEach((attr) => {
            context.getCompiler(attr).compile(context, attr, group, tag);
        });
    }
}
