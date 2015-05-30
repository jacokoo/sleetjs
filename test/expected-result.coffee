{expect} = require 'chai'
fs = require 'fs'
path = require 'path'
{compile} = require '../lib/sleet'

base = path.resolve 'test'

walkFolder = (folder) ->
    folderPath = path.resolve folder
    name = path.relative base, folderPath
    describe name, ->
        for file in fs.readdirSync(folderPath)
            filepath = path.join folderPath, file
            if fs.statSync(filepath).isDirectory()
                walkFolder filepath
            else if path.extname(file) is '.sleet'
                executeFile folderPath, file

executeFile = (dir, file) ->
    name = path.basename(file, path.extname file)
    expectedName = "#{name}-expected.html"
    it "Compile result of [#{file}] should equals to the content of [#{expectedName}]", ->
        compiled = compileIt path.join(dir, file)
        expected = fs.readFileSync(path.join(dir, expectedName), 'utf8').trim() # remove the trailing spaces
        expect(compiled.content).to.equal(expected)

compileIt = (input) ->
    content = fs.readFileSync(input, 'utf8')
    compile content, filename: input

describe 'Expected Result', ->
    walkFolder './test/expected'
