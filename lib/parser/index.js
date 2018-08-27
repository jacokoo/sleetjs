"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser = require("./syntax");
const ast = require("../ast");
function parse(input) {
    return parser.parse(input, { ast });
}
exports.parse = parse;
