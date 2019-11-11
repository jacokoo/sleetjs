import * as fs from 'fs'
import * as path from 'path'
import * as program from 'commander'

import { compile } from './sleet'

export function run(): void {
    program
        .version('version')
        .usage('[options] input [input...]')
        .option('-o, --output <dir>', 'The output directory')
        .option('-w, --watch', 'Watch file changes')
        .parse(process.argv)

    runIt(program.args)
}

function runIt(files: string[]) {

}

