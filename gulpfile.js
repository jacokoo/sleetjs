'use strict';

var fs = require('fs'),
    path = require('path'),
    watchify = require('watchify'),
    browserify = require('browserify'),
    gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    gutil = require('gulp-util'),
    sourcemaps = require('gulp-sourcemaps'),
    connect = require('gulp-connect'),
    eslint = require('gulp-eslint'),

    libs = [
        'handlebars/runtime', 'drizzlejs', 'sleet', 'sleet-handlebars'
    ],
    options = {
        entries: ['./main.js'],
        extensions: ['.hbs'],
        basedir: './scripts',
        debug: false,
        cache: {}, packageCache: {}
    },
    recurse = function(dir, root, b) {
        fs.readdirSync(dir).forEach(function(file) {
            var filename = path.join(dir, file), ext;
            if (fs.statSync(filename).isDirectory()) {
                recurse(filename, root, b);
            } else {
                ext = path.extname(filename);
                if (ext === '.js' || ext === '.hbs') {
                    filename = path.relative(root, filename);
                    filename = path.join(path.dirname(filename), path.basename(filename, ext));
                    filename = './' + filename.replace(/\\/g, '/');
                    b.require({file: filename}, {basedir: root});
                }
            }
        });
    },
    main = function() {
        var b = watchify(browserify(options));
        b.on('update', main);
        b.on('log', gutil.log);
        recurse('./scripts/app', './scripts', b);
        b.external(libs);

        gulp.run('lint');
        connect.reload();

        return b.bundle()
            .on('error', gutil.log.bind(gutil, 'Browserify Error'))
            .pipe(source('main.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./dist'));
    },
    common = function() {
        var b = watchify(browserify({cache: {}, packageCache: {}}));
        b.on('update', common);
        b.on('log', gutil.log);
        b.require(libs);
        return b.bundle()
            .on('error', gutil.log.bind(gutil, 'Browserify Error'))
            .pipe(source('common.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./dist'));
    };

gulp.task('lint', function() {
    gulp.src('scripts/**/*.js')
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('common', common);

gulp.task('main', main);

gulp.task('default', ['main', 'common'], function() {
    connect.server();
});
