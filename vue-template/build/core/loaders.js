const path = require('path');
const { extractUrl,parseFileType,resolve,isAbsoluteUrl } = require('../util/UrlUtil');
const srcDir = require('../util/SrcDir');
const URL = require('url');
let chunkCount = 0;
function cssLoader(content,resources) {
    const _this = this;
    const rootFile = this.root;
    const file = this.file;
    const regexp = /(["'])\s*([^"']+\.css)\s*\1/ig;
    const _root = path.dirname(rootFile);
    content.replace(regexp, function (all,m1,src) {

        if(isAbsoluteUrl(src)){
            return all;
        }
        const urlInfo = URL.parse(src);
        src = urlInfo.pathname;
        src = extractUrl(_root,src);
        _this.execute([src],file);
        resources.set(src,{
            type:'css'
        });
    });
}
function jsLoader(content,resources) {
    const _this = this;
    const rootFile = this.root;
    const regexp = /(["'])\s*([^"']+\.js)\s*\1/ig;
    let dir = path.dirname(rootFile);
    content.replace(regexp, function (all,m1,src) {

        if(isAbsoluteUrl(src)){
            return all;
        }
        const urlInfo = URL.parse(src);
        src = urlInfo.pathname;
        src = extractUrl(dir,src);
        _this.execute([src],rootFile);
        resources.set(src,{
            type:'js'
        });
    });
}
function concatLoader(content,resources){
    let _this = this;
    let file = this.file;
    let rootFile = this.root;
    let regexp = /\/\*\[{2}([\w-_\.]+)?\*\/([\s\S]+?)\/\*\]{2}\*\//ig;
    let commentsReg = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    let jsReg = /(["'])\s*([^"']+\.js)\s*\1/ig;
    let cssReg = /(["'])\s*([^"']+\.css)\s*\1/ig;
    let resRegItems = [
        {
            reg:jsReg,
            type:'js'
        },
        {
            reg:cssReg,
            type:'css'
        }
    ];
    let dir = path.dirname(rootFile);
    let concatBlocks = [];
    content.replace(regexp,function (all,chunkName,resStr,start) {
        resStr = resStr.replace(commentsReg,'');
        resRegItems.forEach(function (item) {
            let srcs = [];
            resStr.replace(item.reg,function (all,m1,src) {
                if(isAbsoluteUrl(src)){
                    return;
                }
                let urlInfo = URL.parse(src);
                src = urlInfo.pathname;
                src = extractUrl(dir,src);
                srcs.push(src);
                return all;
            });
            if(!srcs.length){
                return;
            }
            let outputName = chunkName;
            if(!outputName){
                outputName = (chunkCount++) + '.' + item.type;
            }
            concatBlocks.push({
                items:srcs,
                type:item.type,
                output:{
                    rel:outputName,
                    abs:extractUrl(dir,outputName)
                },
                start:start,
                end:start + all.length
            });
        });
        return all;
    });
    if(concatBlocks.length){
        resources.addConcatItem({
            file:file,
            blocks:concatBlocks
        })
    }
}
function jsonLoader(content,resources){
    const _this = this;
    const rootFile = this.root;
    const regexp = /(["'])\s*([^"']+\.json)\s*\1/ig;
    const dir = path.dirname(rootFile);
    content.replace(regexp, function (all,m1,src) {

        if(isAbsoluteUrl(src)){
            return all;
        }
        const urlInfo = URL.parse(src);
        src = urlInfo.pathname || '';
        src = extractUrl(dir,src);
        _this.execute([src],rootFile);
        resources.set(src,{
            type:'json'
        });
    });
}
function htmlLoader(content,resources) {
    const _this = this;
    const rootFile = this.root;
    const regexp = /(["'])\s*([^"']+\.(?:html|htm|tpl))\s*\1/ig;
    const dir = path.dirname(rootFile);
    content.replace(regexp, function (all,m1,src) {

        if(isAbsoluteUrl(src)){
            return all;
        }
        const urlInfo = URL.parse(src);
        src = urlInfo.pathname || '';
        src = extractUrl(dir,src);
        _this.execute([src],rootFile);
        resources.set(src,{
            type:'html'
        });
    });
}
function fileLoader(content,resources) {
    const _this = this;
    const rootFile = this.root;
    const page = this.page;
    const regexp = /(["'])*(?:src|source|href|pre-url)\1\s*=\s*(["'])\s*([^"']+)\s*\2/ig;
    content.replace(regexp, function (all,m1,m2,src) {

        if(isAbsoluteUrl(src)){
            return all;
        }
        const urlInfo = URL.parse(src);
        src = urlInfo.pathname || '';
        let dir = path.dirname(page.template);
        if(page.templateBasePath){
            dir = resolve(srcDir,dir,page.templateBasePath);
        }
        src = extractUrl(dir,src);
        _this.execute([src],rootFile);
        resources.set(src,{
            type:parseFileType(src) || 'file'
        });
    });
}
function cssFileLoader(content,resources){

    const regexp = /\burl\s*\((["']?)\s*([^"'()]+\.[^"'()]+)\s*\1\s*\)/ig;
    const file = this.file;
    content.replace(regexp, function (all,m1,src) {

        if(isAbsoluteUrl(src)){
            return all;
        }
        const urlInfo = URL.parse(src);
        src = urlInfo.pathname || '';
        const dir = path.dirname(file);
        src = extractUrl(dir,src);
        resources.set(src,{
            type:'file'
        });
    });
}

const parseLoaders = [
    {
        fileRule: /\.js$/,
        loader: cssLoader
    },
    {
        fileRule: /\.js$/,
        loader: jsLoader
    },
    {
        fileRule: '/\.js$/',
        loader: jsonLoader
    },
    {
        fileRule: /\.js$/,
        loader: concatLoader
    },
    {
        fileRule: /\.js$/,
        loader: htmlLoader
    },
    {
        fileRule: /\.html/,
        loader: fileLoader
    },
    {
        fileRule: /\.css$/,
        loader: cssFileLoader
    }
];
module.exports = parseLoaders;