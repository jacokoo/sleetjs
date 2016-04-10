'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.run = run;
/* eslint-disable no-console */
var program = require('commander');
var fs = require('fs');
var path = require('path');

var _require = require('./sleet');

var compile = _require.compile;

var pkg = require('../package.json');
var mode = 511 & ~process.umask();

function isSleetFile(file) {
    return path.extname(file) === '.sleet';
}

function findFilePackageJson(dir) {
    var d = dir;
    while (path.dirname(d) !== d) {
        var file = path.join(dir, 'package.json');
        if (fs.existsSync(file)) {
            var p = require(file);
            return p && p.sleet;
        }
        d = path.dirname(d);
    }
    return null;
}

function recurseDirectory(dir) {
    var result = [dir];
    fs.readdirSync(dir).forEach(function (file) {
        var name = path.join(dir, file);
        if (fs.statSync(name).isDirectory()) {
            result = result.concat(recurseDirectory(name));
        }
    });
    return result;
}

function getSleetFiles(dir) {
    return fs.readdirSync(dir).filter(isSleetFile).map(function (file) {
        return path.join(dir, file);
    });
}

function mkdirp(dir) {
    if (fs.existsSync(dir)) return;
    mkdirp(path.dirname(dir));
    fs.mkdirSync(dir, mode);
}

function relative(file) {
    var r = path.relative('.', file);
    return r.charAt(0) === '/' ? r : './' + r;
}

function getOutputFile(file, output, base) {
    var name = path.basename(file, path.extname(file));
    var dir = path.dirname(file);
    var bb = base || dir;

    if (!output) return path.join(dir, name);
    dir = path.join(path.resolve('.'), output, path.relative(bb, dir));
    mkdirp(dir);
    return path.join(dir, name);
}

function compileIt(file, obj, outputFile) {
    var o = obj;

    if (o.compiling) return;
    o.last || (o.last = 0);

    var mtime = fs.statSync(file).mtime.getTime();
    if (mtime <= o.last) return;

    o.compiling = true;

    var content = fs.readFileSync(file, 'utf8');
    var options = o.options || {};
    options.filename = file;

    try {
        var output = compile(content, options);
        var name = outputFile + '.' + output.extension;
        fs.writeFileSync(name, output.content, 'utf8');
        console.log(new Date().toLocaleTimeString() + ' - Compiled \'' + relative(file) + '\' to \'' + relative(name) + '\'');
    } catch (e) {
        console.log('Can not compile file ' + file);
        console.log(e.stack);
        return;
    } finally {
        o.compiling = false;
        o.last = mtime;
    }
}

function watchFile(file, obj, output) {
    console.log('watching file ' + relative(file));
    var outputFile = getOutputFile(file, output);
    fs.watch(file).on('change', function () {
        return compileIt(file, obj, outputFile);
    });
}

function compileDir(dir, obj, output, inDirFiles) {
    var files = inDirFiles;
    getSleetFiles(dir).forEach(function (f) {
        if (!files[f]) {
            files[f] = { options: obj.options, output: getOutputFile(f, output, obj.root) };
        }
        var o = files[f];
        compileIt(f, o, o.output);
    });
}

function watchDir(dir, obj, output, inDirFiles) {
    console.log('watching directory ' + relative(dir));
    fs.watch(dir).on('change', function () {
        return compileDir(dir, obj, output, inDirFiles);
    });
}

function runIt(files, watch, output) {
    var watched = { files: {}, dirs: {}, inDirFiles: {} };

    var exists = files.filter(fs.existsSync).map(function (file) {
        return path.resolve(file);
    });
    exists.filter(function (file) {
        return fs.statSync(file).isDirectory();
    }).forEach(function (file) {
        var options = findFilePackageJson(file);
        recurseDirectory(file).forEach(function (dir) {
            return watched.dirs[dir] = { options: options, root: file };
        });
    });

    exists.filter(function (file) {
        return !fs.statSync(file).isDirectory() && !watched.dirs[path.dirname(file)] && isSleetFile(file);
    }).forEach(function (file) {
        return watched.files[file] = { options: findFilePackageJson(path.dirname(file)) };
    });

    Object.keys(watched.files).forEach(function (file) {
        compileIt(file, watched.files[file], getOutputFile(file, output));
        watch && watchFile(file, watched.files[file], output);
    });

    Object.keys(watched.dirs).forEach(function (dir) {
        compileDir(dir, watched.dirs[dir], output, watched.inDirFiles);
        watch && watchDir(dir, watched.dirs[dir], output, watched.inDirFiles);
    });
}

function run() {
    program.version(pkg.version).usage('[options] <file> [files...]').option('-o, --output <dir>', 'The output directory').option('-w, --watch', 'Watch file changes').parse(process.argv);

    runIt(program.args, program.watch, program.output);
}
/* eslint-enable no-console */