p = require './package.json'
gulp = require 'gulp'
peg = require 'gulp-peg'
clean = require 'gulp-clean'
coffee = require 'gulp-coffee'
coffeelint = require 'gulp-coffeelint'
uglify = require 'gulp-uglify'
template = require 'gulp-template'

gulp.task 'clean', ->
    gulp.src 'lib', read: false
        .pipe clean()

gulp.task 'parser', ['clean'], ->
    gulp.src 'src/parser/*.pegjs'
        .pipe peg()
        .pipe gulp.dest 'lib/parser'

gulp.task 'coffee', ['parser'], ->
    gulp.src 'src/**/*.coffee'
        .pipe coffeelint '.coffeelint'
        .pipe coffeelint.reporter()
        .pipe coffee bare: true
        .pipe template version: p.version
        .pipe gulp.dest('lib')

gulp.task 'build', ['coffee'], ->
    gulp.src 'lib/**/*.js'
        .pipe uglify()
        .pipe gulp.dest 'lib'

gulp.task 'default', ['build']
