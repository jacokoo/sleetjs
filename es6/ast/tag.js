export class Tag {
    constructor (indent, name, namespace, dots, hash, groups) {
        this._indent = indent;
        this._name = name;
        this._namespace = namespace || '';
        this._dots = dots || [];
        this._hash = hash || '';

        this._children = [];
        this._inlineChar = '';
        this._inlines = [];
        this._attributeGroups = null;

        if (groups) {
            const gs = [];
            gs.unshift(groups.reduce((acc, item) => {
                if (!acc.merge(item)) gs.push(item);
                return acc;
            }));
            this._attributeGroups = gs;
        }
    }

    get type () { return 'tag'; }

    get indent () { return this._indent; }
    get name () { return this._name; }
    get namespace () { return this._namespace; }
    get hash () { return this._hash; }
    get dots () { return this._dots; }
    get attributeGroups () { return this._attributeGroups; }

    get text () { return this._text || []; }
    set text (t) { this._text = t || []; }

    get inlineChar () { return this._inlineChar; }
    set inlineChar (inlineChar) { this._inlineChar = inlineChar; }

    get children () { return this._children; }
    set children (children) {
        if (children.length === 1 && children[0].inlineChar) {
            const child = children[0];
            this._inlines = child._inlines ? children.concat(child._inlines) : children;
            child._inlines = [];
        } else {
            this._children = children;
        }
    }
    get inlines () { return this._inlines; }

    get parent () { return this._parent; }
    set parent (parent) { this._parent = parent; }

    get firstAttribute () {
        if (!this._attributeGroups || this._attributeGroups.length < 1) return null;
        return this._attributeGroups[0].attributes[0];
    }
}
