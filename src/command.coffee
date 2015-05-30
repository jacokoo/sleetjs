fs = require 'fs'
path = require 'path'
{compile} = require './sleet'

SLEET_FILE = '.sleet'
MODE = 0o777 & ~process.umask()
VERSION = 'Sleet version <%= version %>'

yargs = require('yargs').usage '$0 [options] input.st [input2.st...]'
    .describe 'o', 'The output directory'
    .describe 'w', 'Watch file changes'
    .describe 'v', 'Show the version number'
    .describe 'h', 'Show this message'
    .alias 'o', 'output'
    .alias 'w', 'watch'
    .alias 'v', 'version'
    .alias 'h', 'help'
    .boolean 'v'
    .boolean 'h'
    .boolean 'w'
    .string 'o'

exports.run = ->
    argv = yargs.argv

    argv.files = argv._.slice()
    return yargs.showHelp() if argv.h
    return console.log VERSION if argv.v

    runIt argv

runIt = exports.runIt = (options = {}) ->
    files = checkExists(options.files or [])
    return unless files.length > 0

    watched =
        files: {}
        dirs: {}

    for file in files
        if fs.statSync(file).isDirectory()
            pkg = findOptionsInPackage(file, false)
            compileDir file, options, pkg
            watched.dirs[file] = pkg
        else
            pkg = findOptionsInPackage(file, true)
            compileFile file, options, pkg
            watched.files[file] = pkg

    if options.watch
        watchDir key, options, watched.dirs, value for key, value of watched.dirs
        watchFile key, options, watched.files, value for key, value of watched.files when not isFileInWatchedDir(key, watched.dirs)


findOptionsInPackage = (file, isFile) ->
    root = if isFile then path.dirname(file) else file
    root = path.resolve root
    while path.dirname(root) isnt root
        pkg = path.join(root, 'package.json')
        if fs.existsSync(pkg)
            return require(pkg)?.sleet
        root = path.dirname(root)
    null

checkExists = (files) ->
    results = []
    for file in files
        if fs.existsSync file
            results.push path.resolve file
        else
            console.error "The specified file '#{file}' is not exists"
    results


compileFile = (file, options, pkg) ->
    compileIt file, getOutputFile(file, options), options, pkg

compileDir = (dir, options, pkg) ->
    for file in getDirctoryFiles path.resolve(dir)
        compileIt file, getOutputFile(file, options, dir), options, pkg

watchDir = (dir, options, watched, root, pkg) ->
    console.log "watching directory #{dir}"
    root or= dir
    obj = watched[dir] = files: {}

    for file in getDirctoryFiles dir, true
        obj.files[file] = compiling: false, last: mtime(file)
    for file in fs.readdirSync(dir)
        f = path.join dir, file
        if fs.statSync(f).isDirectory()
            o = (obj.files[f] or= {})
            watchDir f, options, o, dir

    obj.watcher = fs.watch(dir).on 'change', ->
        for file in getDirctoryFiles dir, true
            o = (obj.files[file] or= compiling: false, last: mtime(file))
            checkWatchedFile file, o, options, root, pkg


watchFile = (file, options, watched, pkg) ->
    console.log "watching file #{file}"
    obj = watched[file] = compiling: false, last: mtime(file)
    obj.watcher = fs.watch file
        .on 'change', -> checkWatchedFile file, obj, options, pkg

isSleetFile = (file) ->
    path.extname(file) is SLEET_FILE

mkdirp = (dir) ->
    return if fs.existsSync(dir)
    mkdirp path.dirname(dir)
    fs.mkdir dir, MODE

mtime = (file) ->
    fs.statSync(file).mtime.getTime()

dirfiles = (dir, result, notRecursive) ->
    for file in fs.readdirSync dir
        name = path.join dir, file
        if fs.statSync(name).isDirectory()
            dirfiles name, result unless notRecursive
        else if isSleetFile(name)
            result.push name

checkWatchedFile = (file, obj, options, dir, pkg) ->
    time = mtime file
    return unless time - obj.last > 0
    return if obj.compiling
    obj.last = time
    obj.compiling = true
    compileIt file, getOutputFile(file, options, dir), options, pkg
    obj.compiling = false

getOutputFile = (file, options, base) ->
    name = path.basename(file, path.extname(file))
    dir = path.dirname file
    base or= dir
    if options.o
        dir = path.join path.resolve('.'), options.o, path.relative(base, dir)
        mkdirp dir
        path.join dir, name
    else
        path.join dir, name

getDirctoryFiles = (dir, notRecursive) ->
    result = []
    dirfiles dir, result, notRecursive
    result

compileIt = (input, out, options, pkg) ->
    content = fs.readFileSync(input, 'utf8')
    opt = pkg or {}
    opt.filename = input
    try
        output = compile content, opt
    catch e
        return console.log e.stack

    out += '.' + output.extension
    o = opt.transform?(output.content, input, out)
    o or= output.content
    fs.writeFileSync out, o, 'utf8'
    console.log "#{new Date().toLocaleTimeString()} - Compiled '#{input}' to '#{out}'"

isFileInWatchedDir = (file, watched) ->
    return true for key, value of watched when file.indexOf(key) is 0
    false
