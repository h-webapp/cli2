const path = require('path');
const gulp = require('gulp');
const del = require('del');
require('./build/webpack.pro.config');
const config = require('./build/runtime').config;
const srcDir = path.resolve(__dirname,'./src');
const buildConfig = require('./build/build.config');
const fs = require('fs');
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
        fileRule:/\.js$/,
        loader:htmlLoader
    },
    {
        fileRule:/\.(css|html)/,
        loader:fileLoader
    }
];
function cssLoader(content) {
    var rootFile = this.root;
    var file = this.file;
    var regexp = /(["'])\s*([^"'\s]+\.css)\s*\1/g;
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
    var regexp = /(["'])\s*([^"'\s]+\.js)\s*\1/g;
    content.replace(regexp, function (all,m1,src) {
        var dir = path.dirname(rootFile);
        src = extractUrl(dir,src);
        extractFileUrl([src],rootFile);
        resources.set(src,{
            type:'js'
        });
    });
}
function htmlLoader(content) {
    var rootFile = this.root;
    var regexp = /(["'])*(?:src|source|href)\1\s*=\s*(["'])\s*([^"'\s]+\.(?:html|htm|tpl))\s*\2/g;
    content.replace(regexp, function (all,m1,src) {
        var dir = path.dirname(rootFile);
        src = extractUrl(dir,src);
        extractFileUrl([src],rootFile);
        resources.set(src,{
            type:'js'
        });
    });
}
function fileLoader(content) {
    var rootFile = this.root;
    var regexp = /(["'])\s*([^"'\s]+\.[\w]+)\s*\1/g;
    content.replace(regexp, function (all,m1,m2,src) {
        var dir = path.dirname(rootFile);
        src = extractUrl(dir,src);
        extractFileUrl([src],rootFile);
        resources.set(src,{
            type:'file'
        });
    });
}
function extractUrl(dir,src){
    if(src.startsWith('/')){
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

gulp.task('copy',function () {
    buildConfig.pages.forEach(function (page) {
        var envConfig = require(page.envConfig);
        var declares = [],_declares = [];
        var allDeclares = envConfig.modules.concat(envConfig.apps);
        allDeclares.forEach(function (declare) {
            if(declare.compile === false){
                declares.push(path.resolve(srcDir,declare.url));
            }else{
                _declares.push(path.resolve(srcDir,declare.url));
            }
        });

        extractFileUrl(declares.concat(_declares))
    });
    var iterator = resources.entries();
    var entry;
    while((entry = iterator.next()) && !entry.done){
        console.log(entry.value[0]);
    }
});