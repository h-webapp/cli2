const path = require('path');
const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const srcDir = require('./build/util/SrcDir');
const config = require('./build/runtime').config;
function copyLangTask(){
    var stream = gulp.src(srcDir + '/**/lang/*.json');
    stream.pipe(gulp.dest(config.outputDir));
    return stream;
}
function copyCssTask(){

    var stream = gulp.src(path.resolve(srcDir,'index.css'));
    stream.pipe(gulp.dest(config.outputDir));
    return stream;
}
var buildConfig = {
    loaders:[

    ],
    copyTasks:[
        copyLangTask(),
        copyCssTask()
    ]
};
module.exports = buildConfig;
