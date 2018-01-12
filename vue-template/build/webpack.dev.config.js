const path = require('path');
const srcDir = path.resolve(__dirname,'../src')
const Constant = require('./constant');
const buildConfig = require('./build');
var HtmlWebpackPlugin = require('html-webpack-plugin')
var wpkBaseConfig = require('./webpack.conf');
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

    var plugins = [].concat(wpkBaseConfig.plugins);

    if(page.template){
        plugins.push(new HtmlWebpackPlugin({
            template:page.template,
            filename:page.templateFileName,

        }));
    }

    return {
        context:wpkBaseConfig.context,
        module:wpkBaseConfig.module,
        plugins:plugins,
        entry:entry,
        output:page.output
    };
});

module.exports = webpackConfigs;