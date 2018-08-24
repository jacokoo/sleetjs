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
        this._attributeGroups = groups || [];
        this._doMergeAttributeGroups();
    }

    addAttributeGroup (group) {
        this._attributeGroups.push(group);
        this._doMergeAttributeGroups();
    }

    _doMergeAttributeGroups () {
        const groups = this._attributeGroups;
        const gs = groups.filter(g => !!g.setting);
        if (gs.length < groups.length) {
            gs.push(groups.filter(g => !g.setting).reduce((acc, item) => acc.merge(item) && acc));
        }
        this._attributeGroups = gs;
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
        if (!this._attributeGroups.length) return null;
        return this._attributeGroups[0].attributes[0];
    }
}
