/*global require*/
'use strict';

var gulp = require('gulp');
var del = require('del');
var shell = require('gulp-shell');
var rename = require("gulp-rename");
var path = require('path');


// Load plugins
var $ = require('gulp-load-plugins')();
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream'),

    sourceFile = './app/scripts/app.js',

    destFolder = './www/scripts',
    destFileName = 'app.js';

var browserSync = require('browser-sync');
var reload = browserSync.reload;

// Styles
gulp.task('styles', ['sass'  ]);

gulp.task('sass', function() {
    return gulp.src(['app/styles/**/*.scss', 'app/styles/**/*.css'])
        .pipe($.rubySass({
            style: 'expanded',
            precision: 10,
            loadPath: ['app/bower_components']
        }))
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('www/styles'))
        .pipe($.size());
});

gulp.task('stylus', function() {
    return gulp.src(['app/styles/**/*.styl'])
        .pipe($.stylus())
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('www/styles'))
        .pipe($.size());
});


var bundler = watchify(browserify({
    entries: [sourceFile],
    debug: true,
    insertGlobals: true,
    cache: {},
    packageCache: {},
    fullPaths: true
}));

bundler.on('update', rebundle);
bundler.on('log', $.util.log);

function rebundle() {
    return bundler.bundle()
        // log errors if they happen
        .on('error', $.util.log.bind($.util, 'Browserify Error'))
        .pipe(source(destFileName))
        .pipe(gulp.dest(destFolder))
        .on('end', function() {
            reload();
        });
}

// Scripts
gulp.task('scripts', rebundle);

gulp.task('buildScripts', function() {
    return browserify(sourceFile)
        .bundle()
        .pipe(source(destFileName))
        .pipe(gulp.dest('www/scripts'));
});




// HTML
gulp.task('html', function() {
    return gulp.src('app/*.html')
        .pipe($.useref())
        .pipe(gulp.dest('www'))
        .pipe($.size());
});


// xml
gulp.task('xml', function() {
    return gulp.src('app/config-dev.xml')
        .pipe($.useref())
        .pipe(rename('config.xml'))
        .pipe(gulp.dest('www'))
        .pipe($.size());
});

// Images
gulp.task('images', function() {
    return gulp.src('app/images/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('www/images'))
        .pipe($.size());
});

//icon
gulp.task('icon', function() {
    return gulp.src('app/res/icon/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('www/res/icon'))
        .pipe($.size());
});


// Clean
gulp.task('clean', function(cb) {
    $.cache.clearAll();
    cb(del.sync(['www/styles', 'www/scripts', 'www/images']));
});

// Bundle
gulp.task('bundle', ['styles', 'scripts', 'bower'], function() {
    return gulp.src('./app/*.html')
        .pipe($.useref.assets())
        .pipe($.useref.restore())
        .pipe($.useref())
        .pipe(gulp.dest('www'));
});

gulp.task('buildBundle', ['styles', 'buildScripts', 'bower'], function() {
    return gulp.src('./app/*.html')
        .pipe($.useref.assets())
        .pipe($.useref.restore())
        .pipe($.useref())
        .pipe(gulp.dest('www'));
});

// Bower helper
gulp.task('bower', function() {
    gulp.src('app/bower_components/**/*.js', {
            base: 'app/bower_components'
        })
        .pipe(gulp.dest('www/bower_components/'));

});

gulp.task('json', function() {
    gulp.src('app/scripts/json/**/*.json', {
            base: 'app/scripts'
        })
        .pipe(gulp.dest('www/scripts/'));
});

// Robots.txt and favicon.ico
gulp.task('extras', function() {
    return gulp.src(['app/*.txt', 'app/*.ico'])
        .pipe(gulp.dest('www/'))
        .pipe($.size());
});

// Watch
gulp.task('watch', ['html', 'xml' , 'bundle'], function() {

  /*  browserSync({
        notify: false,
        logPrefix: 'BS',
        // Run as an https by uncommenting 'https: true'
        // Note: this uses an unsigned certificate which on first access
        //       will present a certificate warning in the browser.
        // https: true,
        server: ['www', 'app']
    });*/

    // Watch .json files
    gulp.watch('app/scripts/**/*.json', ['json']);

    // Watch .html files
    gulp.watch('app/*.html', ['html']);
    gulp.watch('app/*.xml', ['xml']);

    gulp.watch(['app/styles/**/*.scss', 'app/styles/**/*.css'], ['styles', reload]);

    

    // Watch image files
    gulp.watch('app/images/**/*', reload);
});

// Build
gulp.task('build', ['html', 'xml', 'buildBundle', 'images', 'extras', 'icon'], function() {
    gulp.src('www/scripts/app.js')
        .pipe($.uglify())
        .pipe($.stripDebug())
        .pipe(gulp.dest('www/scripts'));
});

// Default task
gulp.task('default', ['clean', 'build'  , 'jest'  ]);


gulp.task('serve', shell.task([
  'phonegap serve'
]));