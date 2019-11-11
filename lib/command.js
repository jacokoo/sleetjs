"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program = require("commander");
function run() {
    program
        .version('version')
        .usage('[options] input [input...]')
        .option('-o, --output <dir>', 'The output directory')
        .option('-w, --watch', 'Watch file changes')
        .parse(process.argv);
    runIt(program.args);
}
exports.run = run;
function runIt(files) {
}
