const path = require('path');
const webpack = require('webpack');
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const srcDir = path.resolve(__dirname,'../src')
var config = require('./runtime').config;
var wpkConfigs = require('./webpack.build.config');
const buildConfig = require('./build.config');
wpkConfigs.forEach(function (wpkConfig,index) {

    var page = buildConfig.pages[index];
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
    if(page.template){
        let filename = path.basename(page.template);
        plugins.push(new HtmlWebpackPlugin({
            template:page.template,
            filename:filename,
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
});
module.exports = wpkConfigs;