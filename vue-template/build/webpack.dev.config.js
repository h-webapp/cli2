const path = require('path');
const srcDir = path.resolve(__dirname,'../src')
const Constant = require('./constant');
const buildConfig = require('./build');
const HtmlWebpackPlugin = require('html-webpack-plugin');

var wpkBaseConfig = require('./webpack.conf');
var webpackConfigs = buildConfig.pages.map(function (page) {
    var template = page.template;
    var envConfig = page.envConfig;

    var apps = envConfig.apps,modules = envConfig.modules;
    var main = envConfig.main;
    var entry = {};
    var resources = [];

    modules.forEach(function (m) {
        resources.push(path.resolve(srcDir,m.url));
    });
    apps.forEach(function (app) {
        resources.push(path.resolve(srcDir,app.url));
    });

    resources.push(path.resolve(srcDir,main));
    entry[Constant.SYSTEM_MAIN] = resources;

    var plugins = [].concat(wpkBaseConfig.plugins);
    var htmlOptions = {
        template:template
    };
    if(page.templateFileName){
        htmlOptions.filename = page.templateFileName;
    }
    plugins.push(new HtmlWebpackPlugin(htmlOptions));
    return {
        context:wpkBaseConfig.context,
        module:wpkBaseConfig.module,
        plugins:plugins,
        entry:entry,
        output:page.output
    };
});

module.exports = webpackConfigs;