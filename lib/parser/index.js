"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser = require("./syntax");
const ast = require("../ast");
function parse(input, ignoreSetting = true) {
    return parser.parse(input, { ast, ignoreSetting });
}
exports.parse = parse;
