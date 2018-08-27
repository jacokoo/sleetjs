"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ast = require("../ast");
const parser = require("./syntax");
function parse(input) {
    return parser.parse(input, { ast });
}
exports.parse = parse;
