const path = require('path');
const gulp = require('gulp');
const del = require('del');
require('./build/webpack.pro.config');
const config = require('./build/runtime').config;
const srcDir = path.resolve(__dirname,'./src');
gulp.task('clean', function() {
    return del([config.outputDir]);
});

gulp.task('copy',['clean'],function () {
    return gulp.src(['src/**/*'])
        .pipe(gulp.dest(config.outputDir));
});