const program = require('commander');
const fs = require('fs');
const path = require('path');

const { compile } = require('./sleet');
const pkg = require('../package.json');
const mode = 0o777 & ~process.umask();

function isSleetFile (file) {
    return path.extname(file) === '.sleet';
}

function findFilePackageJson (dir) {
    let d = dir;
    while (path.dirname(d) !== d) {
        const file = path.join(dir, 'package.json');
        if (fs.existsSync(file)) {
            const p = require(file);
            return p && p.sleet;
        }
        d = path.dirname(d);
    }
    return null;
}

function recurseDirectory (dir) {
    let result = [dir];
    fs.readdirSync(dir).forEach(file => {
        const name = path.join(dir, file);
        if (fs.statSync(name).isDirectory()) {
            result = result.concat(recurseDirectory(name));
        }
    });
    return result;
}

function getSleetFiles (dir) {
    return fs.readdirSync(dir).filter(isSleetFile).map(file => path.join(dir, file));
}

function mkdirp (dir) {
    if (fs.existsSync(dir)) return;
    mkdirp(path.dirname(dir));
    fs.mkdirSync(dir, mode);
}

function relative (file) {
    const r = path.relative('.', file);
    return r.charAt(0) === '/' ? r : `./${r}`;
}

function getOutputFile (file, output, base) {
    const name = path.basename(file, path.extname(file));
    let dir = path.dirname(file);
    const bb = base || dir;

    if (!output) return path.join(dir, name);
    dir = path.join(path.resolve('.'), output, path.relative(bb, dir));
    mkdirp(dir);
    return path.join(dir, name);
}

function compileIt (file, obj, outputFile) {
    const o = obj;

    if (o.compiling) return;
    o.last || (o.last = 0);

    const mtime = fs.statSync(file).mtime.getTime();
    if (mtime <= o.last) return;

    o.compiling = true;

    const content = fs.readFileSync(file, 'utf8');
    const options = o.options || {};
    options.filename = file;

    try {
        const output = compile(content, options);
        const name = `${outputFile}.${output.extension}`;
        fs.writeFileSync(name, output.content, 'utf8');
        console.log(`${new Date().toLocaleTimeString()} - Compiled '${relative(file)}' to '${relative(name)}'`);
    } catch (e) {
        console.log(`Can not compile file ${file}`);
        console.log(e.stack);
        return;
    } finally {
        o.compiling = false;
        o.last = mtime;
    }
}

function watchFile (file, obj, output) {
    console.log(`watching file ${relative(file)}`);
    const outputFile = getOutputFile(file, output);
    fs.watch(file).on('change', () => compileIt(file, obj, outputFile));
}

function compileDir (dir, obj, output, inDirFiles) {
    const files = inDirFiles;
    getSleetFiles(dir).forEach(f => {
        if (!files[f]) {
            files[f] = { options: obj.options, output: getOutputFile(f, output, obj.root) };
        }
        const o = files[f];
        compileIt(f, o, o.output);
    });
}

function watchDir (dir, obj, output, inDirFiles) {
    console.log(`watching directory ${relative(dir)}`);
    fs.watch(dir).on('change', () => compileDir(dir, obj, output, inDirFiles));
}

function runIt (files, watch, output) {
    const watched = { files: {}, dirs: {}, inDirFiles: {} };

    const exists = files.filter(fs.existsSync).map(file => path.resolve(file));
    exists.filter(file => fs.statSync(file).isDirectory()).forEach(file => {
        const options = findFilePackageJson(file);
        recurseDirectory(file).forEach(dir => watched.dirs[dir] = { options, root: file });
    });

    exists.filter(file => !fs.statSync(file).isDirectory() && !watched.dirs[path.dirname(file)] && isSleetFile(file))
        .forEach(file => watched.files[file] = { options: findFilePackageJson(path.dirname(file)) });

    Object.keys(watched.files).forEach(file => {
        compileIt(file, watched.files[file], getOutputFile(file, output));
        watch && watchFile(file, watched.files[file], output);
    });

    Object.keys(watched.dirs).forEach(dir => {
        compileDir(dir, watched.dirs[dir], output, watched.inDirFiles);
        watch && watchDir(dir, watched.dirs[dir], output, watched.inDirFiles);
    });
}

export function run () {
    program
        .version(pkg.version)
        .usage('[options] <file> [files...]')
        .option('-o, --output <dir>', 'The output directory')
        .option('-w, --watch', 'Watch file changes')
        .parse(process.argv);

    runIt(program.args, program.watch, program.output);
}
