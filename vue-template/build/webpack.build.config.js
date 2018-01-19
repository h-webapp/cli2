const path = require('path');
const srcDir = path.resolve(__dirname,'../src');
const Constant = require('./constant');
const buildConfig = require('./build.config');
const baseConfig = require('./webpack.conf');
const CleanWebpackPlugin = require('clean-webpack-plugin');
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

    var baseDir = srcDir;
    if(page.template){
        baseDir = path.dirname(page.template);
    }
    var main = ensureArray(envConfig.main).map(function (file) {
        return path.resolve(baseDir,file);
    });
    var init = ensureArray(envConfig.init).map(function (file) {
        return path.resolve(baseDir,file);
    });
    var entry = {};
    var resources = [];

    modules.forEach(function (m) {
        if(m.compile !== false){
            resources.push(path.resolve(baseDir,m.url));
        }
    });
    apps.forEach(function (app) {
        if(app.compile !== false){
            resources.push(path.resolve(baseDir,app.url));
        }
    });
    resources = resources.concat(main);


    entry[Constant.SYSTEM_MAIN] = resources;
    if(init.length > 0){
        entry[Constant.SYSTEM_INIT] = init;
    }

    var wpkConfig = baseConfig();

    var plugins = wpkConfig.plugins || [];
    plugins.push(new CleanWebpackPlugin([path.relative(srcDir,page.output.path)],srcDir));
    wpkConfig.entry = entry;
    wpkConfig.output = page.output;
    return wpkConfig;
});

module.exports = webpackConfigs;