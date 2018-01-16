var path = require('path');
const srcDir = path.resolve(__dirname,'../src')
var wpkConfigs = require('./webpack.build.config');
const webpack = require('webpack');
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
wpkConfigs.forEach(function (config) {
    var entry = config.entry;
    Object.keys(entry).forEach(function (key) {
        entry[key] = [path.resolve(srcDir,'../build/hot-client.js')].concat(entry[key]);
    });
    var plugins = config.plugins;
    plugins.push(new webpack.HotModuleReplacementPlugin());
    plugins.push(new webpack.NoEmitOnErrorsPlugin());
    plugins.push(new FriendlyErrorsPlugin());
});
module.exports = wpkConfigs;