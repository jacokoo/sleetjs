export class GroupCompiler {
    compile (context, group, tag) {
        if (group.setting) {
            context.getCompiler(group.setting).compile(context, group, tag);
            return;
        }
        group.attributes.forEach((attr) => {
            context.getCompiler(attr).compile(context, attr, group, tag);
        });
    }
}
