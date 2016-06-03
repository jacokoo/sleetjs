export class GroupCompiler {
    compile (context, group, tag, note) {
        if (group.setting) {
            context.getCompiler(group.setting).compile(context, group, tag, note);
            return;
        }
        group.attributes.forEach((attr) => {
            context.getCompiler(attr).compile(context, attr, group, tag, note);
        });
    }
}
