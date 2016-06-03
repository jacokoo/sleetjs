export class Attribute {
    constructor (name, value, namespace) {
        this._name = name;
        this._value = value;
        this._namespace = namespace || '';
    }

    get type () { return 'attribute'; }

    get name () { return this._name; }
    get value () { return this._value; }
    get namespace () { return this._namespace; }

    get minor () {
        if (!this._name && this._value.length === 1 && this._value[0].minor === 'identifier') {
            return this._value[0].value;
        }
        return null;
    }

    set major (m) {
        this._major = m;
        this._value.forEach(v => v.major = m); // eslint-disable-line no-param-reassign
    }
    get major () { return this._major; }
}

class AttributeContainer {
    constructor (attributes, major) {
        this._attributes = attributes;
        attributes.forEach(attr => attr.major = major); // eslint-disable-line no-param-reassign
    }

    get attributes () { return this._attributes; }
}

Attribute.Setting = class Settings extends AttributeContainer {
    constructor (name, attributes) {
        super(attributes, 'setting');
        this._name = name;
    }

    get type () { return 'setting'; }
    get name () { return this._name; }
};

function merge (target, source) {
    source.forEach(item => {
        const attr = target.find(i => i.name && i.name === item.name);
        attr ? attr._value = attr._value.concat(item._value) : target.push(item);
    });
    return target;
}

Attribute.Group = class Group extends AttributeContainer {
    constructor (attributes, setting) {
        super(merge([], attributes));
        this._setting = setting;
    }

    get type () { return 'group'; }
    get setting () { return this._setting; }

    merge (group) {
        if (group.setting) return false;
        merge(this._attributes, group._attributes);
        return true;
    }
};

class Value {
    get type () { return 'value'; }
    get minor () { return this._minor; }
    get value () { return this._value; }

    get major () { return this._major; }
    set major (m) { this._major = m; }
}

Attribute.Quoted = class Quoted extends Value {
    constructor (value) {
        super();
        this._value = value;
        this._minor = 'quoted';
    }
};

Attribute.Number = class Number extends Value {
    constructor (value) {
        super();
        this._value = value;
        this._minor = 'number';
    }
};

Attribute.Boolean = class Boolean extends Value {
    constructor (value) {
        super();
        this._value = value;
        this._minor = 'boolean';
    }
};

Attribute.Identifier = class Identifier extends Value {
    constructor (value) {
        super();
        this._value = value;
        this._minor = 'identifier';
    }
};

Attribute.Helper = class Helper extends Value {
    constructor (name, attributes) {
        super();
        this._value = '';
        this._attributes = attributes;
        this._minor = 'helper';
        this._name = name;

        attributes.forEach(attr => attr.major = 'helper'); // eslint-disable-line no-param-reassign
    }

    get name () { return this._name; }
    get attributes () { return this._attributes; }
};
