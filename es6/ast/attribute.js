export class Attribute {
    constructor (name, value, namespace) {
        this._name = name;
        this._value = value;
        this._namespace = namespace || '';
    }

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

Attribute.Settings = class Settings extends AttributeContainer {
    constructor (name, attributes) {
        super(attributes);
        this._name = name;
    }

    get name () { return this._name; }
};

Attribute.Helper = class Helper extends Attribute.Settings {
    constructor (name, attributes) {
        super(name, attributes);
        this._type = 'helper';
    }

    get type () { return this._type; }
};

Attribute.Group = class Group extends AttributeContainer {
    constructor (attributes, settings) {
        super(attributes);
        this._settings = settings;
    }

    get settings () { return this._settings; }
};
