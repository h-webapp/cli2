const path = require('path');
const gulp = require('gulp');
const gulpMerge = require('merge-stream');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
require('./build/webpack.pro.config');
const config = require('./build/runtime').config;
const srcDir = path.resolve(__dirname,'./src');
const buildConfig = require('./build/build.config');
const fs = require('fs');
const userResources = require('./resources');

gulp.task('clean', function() {
    return del([config.outputDir]);
});

var resources = new Map();
var parseLoaders = [
    {
        fileRule:/\.js$/,
        loader:cssLoader
    },
    {
        fileRule:/\.js$/,
        loader:jsLoader
    },
    {
        fileRule:'/\.js$/',
        loader:jsonLoader
    },
    {
        fileRule:/\.js$/,
        loader:htmlLoader
    },
    {
        fileRule:/\.html/,
        loader:fileLoader
    },
    {
        fileRule:/\.css$/,
        loader:cssFileLoader
    }
];
function cssLoader(content) {
    var rootFile = this.root;
    var file = this.file;
    var regexp = /(["'])\s*([^"']+\.css)\s*\1/g;
    content.replace(regexp, function (all,m1,src) {
        var _root = path.dirname(rootFile);
        src = extractUrl(_root,src);
        extractFileUrl([src],file);
        resources.set(src,{
            type:'css'
        });
    });
}
function jsLoader(content) {
    var rootFile = this.root;
    var regexp = /(["'])\s*([^"']+\.js)\s*\1/g;
    content.replace(regexp, function (all,m1,src) {
        var dir = path.dirname(rootFile);
        src = extractUrl(dir,src);
        extractFileUrl([src],rootFile);
        resources.set(src,{
            type:'js'
        });
    });
}
function jsonLoader(content){
    var rootFile = this.root;
    var regexp = /(["'])\s*([^"']+\.json)\s*\1/g;
    content.replace(regexp, function (all,m1,src) {
        var dir = path.dirname(rootFile);
        src = extractUrl(dir,src);
        extractFileUrl([src],rootFile);
        resources.set(src,{
            type:'json'
        });
    });
}
function htmlLoader(content) {
    var rootFile = this.root;
    var regexp = /(["'])\s*([^"']+\.(?:html|htm|tpl))\s*\1/g;
    content.replace(regexp, function (all,m1,src) {

        var dir = path.dirname(rootFile);
        src = extractUrl(dir,src);
        extractFileUrl([src],rootFile);
        resources.set(src,{
            type:'html'
        });
    });
}
function fileLoader(content) {
    var rootFile = this.root;
    var file = this.file;
    var regexp = /(["'])*(?:src|source|href)\1\s*=\s*(["'])\s*([^"']+\.[\w]+)\s*\2/g;
    content.replace(regexp, function (all,m1,m2,src) {

        var dir = path.dirname(rootFile);
        src = extractUrl(dir,src);
        extractFileUrl([src],rootFile);
        resources.set(src,{
            type:'file'
        });
    });
}
function cssFileLoader(content){
    var rootFile = this.root;
    var file = this.file;
    var regexp = /\burl\s*\((["'])\s*([^"']+\.[\w]+)\s*\1\s*\)/g;
    content.replace(regexp, function (all,m1,src) {

        var dir = path.dirname(rootFile);
        src = extractUrl(dir,src);
        extractFileUrl([src],rootFile);
        resources.set(src,{
            type:'file'
        });
    });
}
function isAbsoluteUrl(src){
    return /^(https*|file):\/\//.test(src);
}
function isNodeModuleUrl(src){
    return /^\/node_modules\b/.test(src);
}
function extractUrl(dir,src){

    if(isAbsoluteUrl(src)){
        return src;
    }else if(isNodeModuleUrl(src)){
        src = path.resolve(__dirname,src.replace(/^\/+/g,''));
    }else{
        src = path.resolve(dir,src);
    }
    return src;
}
function extractFileUrl(files,rootFile){

    files.forEach(function (file) {

        if(!fs.existsSync(file)){
            return;
        }
        if(resources.has(file)){
            return;
        }
        var content = fs.readFileSync(file).toString();
        parseLoaders.forEach(function (loader) {
            if(!file.match(loader.fileRule)){
                return;
            }
            loader.loader.call({
                file:file,
                root:rootFile || file
            },content);
        });
    });
}
function parseFileType(file){
    if(/\.js$/.test(file)){
        return 'js';
    }
    if(/\.css$/.test(file)){
        return 'css';
    }
}
function copyFile(file,fileConfig){

    let distDir;
    if(isNodeModuleUrl(file)){
        distDir = path.relative(__dirname,file).replace(/\\/,'/');
    }else{
        distDir = path.relative(srcDir,file).replace(/\\/,'/');
    }
    distDir = path.resolve(config.outputDir,distDir);
    distDir = path.dirname(distDir);

    var stream = gulp.src(file);
    var fileType = fileConfig.type || parseFileType(file);
    if(fileType === 'js'){
        stream.pipe(uglify({
            compress:{
                drop_console:true,
                unused:true,
                dead_code:true
            }
        }));
    }else if(fileType === 'css'){
        stream.pipe(cleanCSS());
    }
    stream.on('error', function (err) {
        console.error(err);
    });
    stream.pipe(gulp.dest(distDir));
    return stream;
}
function copyLangFiles(){
    var stream = gulp.src(srcDir + '/**/*.json');
    stream.pipe(gulp.dest(config.outputDir));
    return stream;
}
gulp.task('copy',function () {
    var validFiles = {};
    buildConfig.pages.forEach(function (page) {

        var envConfig = require(page.envConfig);

        validFiles[page.envConfig] = {
            type:'json'
        };

        var allDeclares = envConfig.modules.concat(envConfig.apps);
        allDeclares = allDeclares.map(function (declare) {
            var file = path.resolve(srcDir,declare.url);
            if(declare.compile === false){
                validFiles[file] = {
                    type:'js'
                };
            }
            return file;
        });

        extractFileUrl(allDeclares)
    });
    var iterator = resources.entries();
    var entry;
    var streams = [];
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

    userResources.forEach(function (resource) {
        var file = extractUrl(srcDir,resource.url);
        streams.push(copyFile(file,{
            type:resource.type
        }));
    });

    streams.push(copyLangFiles());
    return gulpMerge(streams);
});