const path = require('path');
const srcDir = require('./util/SrcDir');
var runtime = require('./runtime');
runtime.config = Object.assign(runtime.config,{
    minimize:true,
    hotReplace:false,
    sourceMap:false,
    extractCss:true,
    outputDir:path.resolve(srcDir,'../release')
});

var config = runtime.config;
const buildConfig = require('./build.config');
var wpkConfigs = require('./webpack.build.config');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');

var outputDir  = config.outputDir;
wpkConfigs.forEach(function (wpkConfig,index) {

    var page = buildConfig.pages[index];
    var plugins = wpkConfig.plugins;
    var output = wpkConfig.output;
    output.path = path.resolve(outputDir,path.relative(srcDir,output.path));


    plugins.push(new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"'
    }));


    /*plugins.push(new webpack.optimize.UglifyJsPlugin({
        uglifyOptions: {
            compress: {
                warnings: false
            }
        },
        sourceMap: config.sourceMap,
        parallel: true
    }));*/


    if(page.template){
        let filename = path.resolve(outputDir,path.relative(srcDir,page.template));

        plugins.push(new HtmlWebpackPlugin({
            template:page.template,
            filename:filename,
            inject:true,
            cache:false,
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