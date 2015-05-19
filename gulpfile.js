var gulp = require('gulp');
var ts = require('gulp-typescript');
var browserify = require('browserify');
var source = require("vinyl-source-stream");
var reactify = require('reactify');

gulp.task('default', ['ts', 'bundle', 'move']);


gulp.task('ts', function() {
    var tsResult = gulp
                .src('frontend/**/*.ts')
                .pipe(ts({
                    noEmitOnError : true,
                    module: 'commonjs',
                    outDir: 'bin'
                }));


    return tsResult.js.pipe(gulp.dest('./bin'));
});

gulp.task('move', ['move-component', 'move-statics']);

gulp.task('move-component', function(cb) {
    // move components
    var jsx = gulp.src('frontend/component/*.jsx')
                  .pipe(gulp.dest('./bin/component'));

    jsx.on('end', function() {
        cb();
    });
});

gulp.task('move-statics', function(cb) {
    // move static
    var stat = gulp.src('frontend/static/**/*')
                  .pipe(gulp.dest('./bin/static'));

    stat.on('end', function() {
        cb();
    });
});

gulp.task('bundle', ['move'], function(cb) {
    var b = browserify();
    b.transform(reactify); // use the reactify transform
    b.add('./bin/main.js');

    b.bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest('./bin/static/js'));

    b.on('end', function() {
        cb();
    });
});
