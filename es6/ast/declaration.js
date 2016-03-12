export class Declaration {
    constructor (name, ext, pairs) {
        this._name = name;
        this._options = {};
        this._extension = ext;

        pairs.map((item) => this._options[item.key] = item.value);
    }

    get name () {
        return this._name;
    }

    get extension () {
        return this._extension;
    }

    option (key) {
        return this._options[key];
    }
}
