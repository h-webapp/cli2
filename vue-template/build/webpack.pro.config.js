var runtime = require('./runtime');
runtime.config = Object.assign(runtime.config,{
    minimize:true,
    hotReplace:false,
    sourceMap:false,
    extractCss:true
});
var config = runtime.config;
var wpkConfigs = require('./webpack.build.config');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const srcDir = path.resolve(__dirname,'../src');
const CleanWebpackPlugin = require('clean-webpack-plugin');
wpkConfigs.forEach(function (wpkConfig) {
    var plugins = wpkConfig.plugins;
    var output = wpkConfig.output;
    var outputDir  = path.resolve(srcDir,'../dist');
    output.path = path.resolve(outputDir,path.relative(srcDir,output.path));
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        uglifyOptions: {
            compress: {
                warnings: false
            }
        },
        sourceMap: config.sourceMap,
        parallel: true
    }));
    plugins.push(new CleanWebpackPlugin(['./*'],outputDir));
    plugins.push(new CopyWebpackPlugin([
        {
            from:srcDir,
            to:path.resolve(srcDir,'../dist')
        },
        {

        }
    ]));
});
module.exports = wpkConfigs;