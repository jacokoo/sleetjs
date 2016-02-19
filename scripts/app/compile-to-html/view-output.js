exports.bindings = {
    code: 'reset'
};

exports.reset = function() {
    this.components.result.setValue(this.bindings.code.data.output, -1);
};

exports.components = [{
    id: 'result', name: 'ace', options: { mode: 'handlebars', readonly: true }
}];
