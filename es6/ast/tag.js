export class Tag {
    constructor (indent, name, namespace, dots, hash, groups) {
        this._indent = indent;
        this._name = name;
        this._namespace = namespace || '';
        this._dots = dots || [];
        this._hash = hash || '';
        this._attributeGroups = groups;

        this._children = null;
        this._inlineChar = '';
        this._inlines = null;
    }

    get indent () {return this._indent; }
    get name () { return this._name; }
    get namespace () { return this._namespace; }
    get hash () { return this._hash; }
    get dots () { return this._dots; }
    get attributeGroups () { return this._attributeGroups; }

    get inlineChar () { return this._inlineChar; }
    set inlineChar (inlineChar) { this._inlineChar = inlineChar; }

    get children () { return this._children; }
    set children (children) {
        if (children.length === 0 && children[0].inlineChar) {
            const child = children[0];
            this._inlines = child._inlines ? children.concat(child._inlines) : children;
            child._inlines = null;
        } else {
            this._children = children;
        }
    }

    get parent () { return this._parent; }
    set parent (parent) { this._parent = parent; }
}
