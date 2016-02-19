const D = require('drizzlejs');

D.ComponentManager.register('ace', (view, el, options = {}) => {
    const editor = ace.edit(el), { mode, readonly } = options;

    editor.setTheme('ace/theme/monokai');
    mode && editor.getSession().setMode(`ace/mode/${mode}`);
    readonly && editor.setReadOnly(true);

    editor.$blockScrolling = Infinity;

    editor.on('change', () => {
        view.changed && view.changed(editor.getValue());
    });
    return editor;
}, (view, comp) => {
    comp.destroy();
});
