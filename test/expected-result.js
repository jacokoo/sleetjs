'use strict';

const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');
const compile = require('../lib/sleet').compile;

const base = path.resolve('test');

function compileIt(input) {
    const content = fs.readFileSync(input, 'utf8');
    return compile(content, {filename: input});
}

function executeFile(dir, file) {
    const name = path.basename(file, path.extname(file));
    const expectedName = `${name}-expected.html`;

    it(`Compile result of [${file}] should equals to the content of [${expectedName}]`, () => {
        const compiled = compileIt(path.join(dir, file));
        const expected = fs.readFileSync(path.join(dir, expectedName), 'utf8');

        expect(compiled.content).to.equal(expected);
    });
}

function walkFolder(folder) {
    let folderPath = path.resolve(folder);
    const name = path.relative(base, folderPath);

    describe(name, () => {
        fs.readdirSync(folderPath).forEach(file => {
            const filepath = path.join(folderPath, file);
            if (fs.statSync(filepath).isDirectory()) {
                walkFolder(filepath);
            } else if (path.extname(file) === '.sleet') {
                executeFile(folderPath, file);
            }
        });
    });
}

describe('Expected Result', () => {
    walkFolder('./test/expected');
});
