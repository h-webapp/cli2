const contextPath = __dirname;
const path = require('path');
const gulp = require('gulp');
const gulpMerge = require('merge-stream');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');

const babel = require('gulp-babel');
const del = require('del');
const config = require('./build/runtime.pro').config;
const srcDir = require('./build/util/SrcDir');
const buildConfig = require('./build/build.config');
const fs = require('fs');
const {isNodeModuleUrl,parseFileType,isAbsoluteUrl} = require('./build/util/UrlUtil');
const extractFileUrl = require('./build/core/resource-extract');
let contentProcess = require('./build/gulp/content-process');
const taskConfig = require('./task-config');
const compiledEntries = new Map();
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
            })).pipe(uglify({
                compress:{
                    drop_console:true,
                    unused:true,
                    dead_code:true
                }
            }));
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

const fileContents = new Map(),concatMap = new Map();
const concatItemMap = new Map();
const extractContent = require('./build/gulp/concated-content');
function getFileContent(file){
    if(!concatMap.has(file.path)){
        return file.contents;
    }
    let concatItem = concatMap.get(file.path);
    let content = String(file.contents);
    let result = concatResourceDep(concatItem,content);
    return new Buffer(result);
}
function concatBlockItems(block) {
    let stream = gulp.src(block.items).pipe(extractContent(getFileContent));
    let type = block.type;
    if(type === 'js'){
        stream = stream.pipe(babel({
            babelrc: false,
            presets: [[ "es2015", { modules: false } ]],
            plugins: []
        })).pipe(uglify({
                compress:{
                    drop_console:true,
                    unused:true,
                    dead_code:true
                }
            }));
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
function concatResourceDep(concatItem,content){

    if(fileContents.has(concatItem.file)){
        return fileContents.get(concatItem.file);
    }

    let result = '';
    let blocks = concatItem.blocks;
    let left = 0;
    blocks.forEach(function (block) {
        let start = block.start,end = block.end;
        result += content.substring(left,start);
        result += "'" + block.output.rel + "'";
        left = end;
    });
    result += content.substring(left);

    fileContents.set(concatItem.file,result);
    return result;
}
function concatFile(concatItem){
    let blocks = concatItem.blocks;
    let streams = [];
    if(!concatItemMap.has(concatItem.file)){
        let stream = gulp.src(concatItem.file).pipe(contentProcess(function (str) {
            return concatResourceDep(concatItem,str);
        }));
        stream = stream.pipe(uglify({
            compress:{
                drop_console:true,
                unused:true,
                dead_code:true
            }
        })).on('error', function (err) {
            console.error(err);
        });
        stream.pipe(gulp.dest(parseDistDir(concatItem.file)));
        streams.push(stream);
    }
    let _blockSteams = blocks.map(function (block) {
        return concatBlockItems(block);
    });

    streams = streams.concat(_blockSteams);

    return streams;
}
function processConcat(resources){
    let concatItems = resources.getConcatItems();
    let resourceRel = resources.getResourceRel();
    concatItems.forEach(function (item) {
        if(compiledEntries.has(item.file)){
            return;
        }
        concatMap.set(item.file,item);
        resources.remove(item.file);
        item.blocks.forEach(function (block) {
            block.items.forEach(function (src) {
                concatItemMap.set(src,true);
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
                }else{
                    compiledEntries.set(file,true);
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

    let concatSteams = [];
    if(buildConfig.concat){
        processConcat(resources);
        concatSteams = resources.getConcatItems().filter(function (item) {
            return !compiledEntries.has(item.file);
        }).map(function (concatItem) {
            return concatFile(concatItem);
        });
    }

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

    streams = streams.concat(concatSteams);

    streams = streams.concat(taskConfig.copyTasks());
    return gulpMerge(streams);
});

gulp.run('copy')