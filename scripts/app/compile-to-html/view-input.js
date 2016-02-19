exports.bindings = {
    code: false
};

exports.components = [{
    id: 'input', name: 'ace'
}];

exports.mixin = {
    changed: function(code) {
        this.module.dispatch('compile', { input: code });
    }
};
