const path = require('path');
const { extractUrl } = require('../util/UrlUtil');
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
function cssLoader(content,resources) {
    var _this = this;
    var rootFile = this.root;
    var file = this.file;
    var regexp = /(["'])\s*([^"']+\.css)\s*\1/g;
    content.replace(regexp, function (all,m1,src) {
        var _root = path.dirname(rootFile);
        src = extractUrl(_root,src);
        _this.execute([src],file);
        resources.set(src,{
            type:'css'
        });
    });
}
function jsLoader(content,resources) {
    var _this = this;
    var rootFile = this.root;
    var regexp = /(["'])\s*([^"']+\.js)\s*\1/g;
    content.replace(regexp, function (all,m1,src) {
        var dir = path.dirname(rootFile);
        src = extractUrl(dir,src);
        _this.execute([src],rootFile);
        resources.set(src,{
            type:'js'
        });
    });
}
function jsonLoader(content,resources){
    var _this = this;
    var rootFile = this.root;
    var regexp = /(["'])\s*([^"']+\.json)\s*\1/g;
    content.replace(regexp, function (all,m1,src) {
        var dir = path.dirname(rootFile);
        src = extractUrl(dir,src);
        _this.execute([src],rootFile);
        resources.set(src,{
            type:'json'
        });
    });
}
function htmlLoader(content,resources) {
    var _this = this;
    var rootFile = this.root;
    var regexp = /(["'])\s*([^"']+\.(?:html|htm|tpl))\s*\1/g;
    content.replace(regexp, function (all,m1,src) {

        var dir = path.dirname(rootFile);
        src = extractUrl(dir,src);
        _this.execute([src],rootFile);
        resources.set(src,{
            type:'html'
        });
    });
}
function fileLoader(content,resources) {
    var _this = this;
    var rootFile = this.root;
    var page = this.page;
    var regexp = /(["'])*(?:src|source|href)\1\s*=\s*(["'])\s*([^"']+\.[\w]+)\s*\2/g;
    content.replace(regexp, function (all,m1,m2,src) {

        var dir = path.dirname(page.template);
        src = extractUrl(dir,src);
        _this.execute([src],rootFile);
        resources.set(src,{
            type:'file'
        });
    });
}
function cssFileLoader(content,resources){
    var _this = this;
    var rootFile = this.root;
    var file = this.file;
    var regexp = /\burl\s*\((["'])\s*([^"']+\.[\w]+)\s*\1\s*\)/g;
    content.replace(regexp, function (all,m1,src) {

        var dir = path.dirname(rootFile);
        src = extractUrl(dir,src);
        _this.execute([src],rootFile);
        resources.set(src,{
            type:'file'
        });
    });
}
module.exports = parseLoaders;