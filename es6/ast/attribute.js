export class Attribute {
    constructor (name, value, namespace) {
        this._name = name;
        this._value = value;
        this._namespace = namespace || '';
    }

    get type () { return this._name ? 'attribute' : 'attribute-no-name'; }

    get name () { return this._name; }
    get value () { return this._value; }
    get namespace () { return this._namespace; }
}

class AttributeContainer {
    constructor (attributes) {
        this._attributes = attributes;
    }

    get attributes () { return this._attributes; }
}

Attribute.Setting = class Settings extends AttributeContainer {
    constructor (name, attributes) {
        super(attributes);
        this._name = name;
    }

    get type () { return 'setting'; }

    get name () { return this._name; }
};

Attribute.Group = class Group extends AttributeContainer {
    constructor (attributes, setting) {
        super(attributes);
        this._setting = setting;
    }

    get type () { return 'group'; }

    get setting () { return this._setting; }
};

class Value {
    get type () { return 'value'; }
    get minor () { return this._minor; }
    get value () { return this._value; }
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
    }

    get name () { return this._name; }
    get attributes () { return this._attributes; }
};
