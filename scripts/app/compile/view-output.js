exports.bindings = {
    output: 'reset',
    state: 'setState'
};

exports.setState = function() {
    const to = this.bindings.state.data.to, comp = this.components.result;
    this.$('to').innerHTML = to;
    comp.getSession().setMode('ace/mode/' + (to === 'sleet' ? 'sleet' : 'handlebars'));
};

exports.reset = function() {
    this.components.result.setValue(this.bindings.output.data, -1);
};

exports.components = [{
    id: 'result', name: 'ace', options: { mode: 'handlebars', readonly: true }
}];
