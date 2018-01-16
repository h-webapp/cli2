const path = require('path');
const srcDir = path.resolve(__dirname,'../src')
const Constant = require('./constant');
const buildConfig = require('./build.config');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.conf');
function ensureArray(arr) {
    if(!arr){
        return [];
    }
    if(!(arr instanceof Array)){
        arr = [].concat(arr);
    }
    return arr;
}
var webpackConfigs = buildConfig.pages.map(function (page) {
    var envConfig = require(page.envConfig);

    var apps = envConfig.apps,modules = envConfig.modules;
    var main = ensureArray(envConfig.main).map(function (file) {
        return path.resolve(srcDir,file);
    });
    var init = ensureArray(envConfig.init).map(function (file) {
        return path.resolve(srcDir,file);
    });
    var entry = {};
    var resources = [];

    modules.forEach(function (m) {
        resources.push(path.resolve(srcDir,m.url));
    });
    apps.forEach(function (app) {
        resources.push(path.resolve(srcDir,app.url));
    });
    resources = resources.concat(main);


    entry[Constant.SYSTEM_MAIN] = resources;
    if(init.length > 0){
        entry[Constant.SYSTEM_INIT] = init;
    }

    var wpkConfig = baseConfig();
    var plugins = wpkConfig.plugins;

    if(page.template){
        plugins.push(new HtmlWebpackPlugin({
            template:page.template,
            filename:page.templateFileName,
            chunksSortMode:function (chunk1,chunk2) {
                var n1 = chunk1.names[0],n2 = chunk2.names[0];
                if(n1 > n2){
                    return 1;
                }else if(n1 < n2){
                    return -1;
                }
                return 0;
            }
        }));
    }
    wpkConfig.entry = entry;
    wpkConfig.output = page.output;
    return wpkConfig;
});

module.exports = webpackConfigs;