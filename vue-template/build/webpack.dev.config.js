const path = require('path');
const webpack = require('webpack');
var wpkConfigs = require('./webpack.build.config');
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const srcDir = path.resolve(__dirname,'../src')
var config = require('./runtime').config;
wpkConfigs.forEach(function (wpkConfig) {
    var plugins = wpkConfig.plugins;
    var entry = wpkConfig.entry;
    if(config.hotReplace){
        Object.keys(entry).forEach(function (key) {
            entry[key] = [path.resolve(srcDir,'../build/hot-client.js')].concat(entry[key]);
        });
        plugins.push(new webpack.HotModuleReplacementPlugin());
        plugins.push(new webpack.NoEmitOnErrorsPlugin());
        plugins.push(new FriendlyErrorsPlugin());
    }
});
module.exports = wpkConfigs;