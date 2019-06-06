const contextPath = __dirname;
const path = require('path');
const gulp = require('gulp');
const gulpMerge = require('merge-stream');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
let replace = require('gulp-replace');
const babel = require('gulp-babel');
const del = require('del');
const config = require('./build/runtime.pro').config;
const srcDir = require('./build/util/SrcDir');
const buildConfig = require('./build/build.config');
const fs = require('fs');
const {isNodeModuleUrl,parseFileType,isAbsoluteUrl} = require('./build/util/UrlUtil');
const extractFileUrl = require('./build/core/resource-extract');
const taskConfig = require('./task-config');
gulp.task('clean', function() {
    return del.sync([config.outputDir]);
});
function parseDistDir(file){
    let distDir;
    const regexp = /\\/g;
    if(isNodeModuleUrl(distDir = path.relative(contextPath,file).replace(regexp,'/'))){
    }else{
        distDir = path.relative(srcDir,file).replace(regexp,'/');
    }
    distDir = path.resolve(config.outputDir,distDir);
    distDir = path.dirname(distDir);
    return distDir;
}
function copyFile(file,fileConfig){

    let distDir = parseDistDir(file);

    let stream = gulp.src(file);
    const fileType = fileConfig.type || parseFileType(file);
    if(fileType === 'js'){
        if(!file.endsWith('.min.js')){
            stream = stream.pipe(babel({
                babelrc: false,
                presets: [[ "es2015", { modules: false } ]],
                plugins: []
            }))/*.pipe(uglify({
                compress:{
                    drop_console:true,
                    unused:true,
                    dead_code:true
                }
            }));*/
        }
    }else if(fileType === 'css'){
        stream = stream.pipe(cleanCSS());
    }

    stream = stream.on('error', function (err) {
        console.error(err);
    });
    stream = stream.pipe(gulp.dest(distDir));
    return stream;
}
function concatBlockItems(block) {
    let stream = gulp.src(block.items);
    let type = block.type;
    if(type === 'js'){
        stream = stream.pipe(babel({
            babelrc: false,
            presets: [[ "es2015", { modules: false } ]],
            plugins: []
        }))/*.pipe(uglify({
                compress:{
                    drop_console:true,
                    unused:true,
                    dead_code:true
                }
            }));*/
    }else if(type === 'css'){
        stream = stream.pipe(cleanCSS());
    }
    stream = stream.on('error', function (err) {
        console.error(err);
    });
    stream = stream.pipe(concat(block.output.rel));
    let distDir = parseDistDir(block.output.abs);
    stream = stream.pipe(gulp.dest(distDir));
    return stream;
}
function concatFile(concatItem){
    let blocks = concatItem.blocks;
    let stream = gulp.src(concatItem.file).pipe(replace(/^[\s\S]*$/,function (str) {
        let result = '';
        let left = 0;
        blocks.forEach(function (block) {
            let start = block.start,end = block.end;
            result += str.substring(left,start);
            result += "'" + block.output.rel + "'";
            left = end;
        });
        result += str.substring(left);
        return result;
    }));

    stream.pipe(gulp.dest(parseDistDir(concatItem.file)));

    let streams = [stream];
    let _blockSteams = blocks.map(function (block) {
        return concatBlockItems(block);
    });

    streams = streams.concat(_blockSteams);

    return streams;
}
gulp.task('copy',['clean'],function () {
    const validFiles = {};
    buildConfig.pages.forEach(function (page) {

        const allDeclares = [];
        if(page.envConfig){
            let envConfig = require(page.envConfig);
            validFiles[page.envConfig] = {
                type:'json'
            };
            envConfig.modules.concat(envConfig.apps).forEach(function (declare) {
                if(isAbsoluteUrl(declare.url)){
                    return;
                }
                let file = path.resolve(srcDir,declare.url);
                if(declare.compile === false){
                    validFiles[file] = {
                        type:'js'
                    };
                }
                allDeclares.push(file);
            });
        }

        const extractFn = extractFileUrl.bind(page);
        extractFn(allDeclares);
        if(page.template){
            extractFn(page.template);
        }
    });
    let resources = extractFileUrl.resources;
    let concatItems = resources.getConcatItems();
    let resourceRel = resources.getResourceRel();
    console.log(JSON.stringify(concatItems,null,4));
    concatItems.forEach(function (item) {
        resources.remove(item.file);
        item.blocks.forEach(function (block) {
            block.items.forEach(function (src) {
                let count = resourceRel[src];
                if(!count){
                    return;
                }
                count--;
                if(!count){
                    resources.remove(src);
                }
            });
        });
    });
    const iterator = resources.entries();
    let entry;
    let streams = [];
    while((entry = iterator.next()) && !entry.done){
        let file = entry.value[0];
        let fileConfig = entry.value[1];
        if(isAbsoluteUrl(file)){
            continue;
        }
        if(!fs.existsSync(file) || !fs.statSync(file).isFile()){
            continue;
        }


        streams.push(copyFile(file,fileConfig));
    }

    Object.keys(validFiles).forEach(function (file) {
        streams.push(copyFile(file,validFiles[file]));
    });

    let concatSteams = concatItems.map(function (concatItem) {
        return concatFile(concatItem);
    });
    streams = streams.concat(concatSteams);

    streams = streams.concat(taskConfig.copyTasks());
    return gulpMerge(streams);
});

gulp.run('copy')