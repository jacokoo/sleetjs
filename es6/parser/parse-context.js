import {Tag} from '../ast/tag';
import {Declaration} from '../ast/declaration';
import {Attribute} from '../ast/attribute';

export class ParseContext {
    constructor () {
        this._indentToken = null;
        this._indent = 0;
        this._parents = [];
        this._result = {};
        this._current = null;
    }

    parent () {
        return this._parents[this._parents.length - 1];
    }

    current() {
        return this._current;
    }

    createDeclare (name) {
        return this._current = this._result.declare = new Declare(name);
    }
}
