exports.bindings = {
    input: 'setInput',
    state: 'setState'
};

exports.setState = function() {
    const from = this.bindings.state.data.from, comp = this.components.input;
    this.$('from').innerHTML = from;
    comp.getSession().setMode('ace/mode/' + (from === 'sleet' ? 'sleet' : 'handlebars'));
};

exports.setInput = function() {
    this.components.input.setValue(this.bindings.input.data, -1);
};

exports.actions = {
    'click reverse': 'reverseIt'
};

exports.components = [{
    id: 'input', name: 'ace', options: { mode: 'sleet' }
}];

exports.mixin = {
    changed: function(code) {
        this.module.dispatch('compile', { input: code });
    }
};
