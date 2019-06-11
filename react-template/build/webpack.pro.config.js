const path = require('path');
const srcDirConfig = require('./util/SrcDir');
srcDirConfig.setMode('release');
const srcDir = srcDirConfig.get();
const runtime = require('./runtime.pro');

const config = runtime.config;
const wpkConfigs = require('./webpack.build.config');
const webpack = require('webpack');

const version = require('./version');
version.update();

const outputDir = config.outputDir;
wpkConfigs.forEach(function (wpkConfig) {

    const plugins = wpkConfig.plugins;
    const output = wpkConfig.output;
    output.path = path.resolve(outputDir,path.relative(srcDir,output.path));


    plugins.push(new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"'
    }));

    plugins.push(new webpack.optimize.UglifyJsPlugin({
        uglifyOptions: {
            compress: {
                warnings: false
            }
        },
        sourceMap: config.sourceMap,
        parallel: true
    }));



});

module.exports = wpkConfigs;