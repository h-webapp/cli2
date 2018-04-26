const path = require('path');
const webpack = require('webpack');
var merge = require('webpack-merge')
const Constant = require('./constant');
const srcDir = require('./util/SrcDir');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var buildConfig = require('./build.config');
var resourceRules = require('./resource-loader').rules;
function assetsPath(_path){
    return path.posix.join(buildConfig.resourceDir, _path);
}
function baseConfig() {
    var _baseConfig = {
        context:__dirname + '/src',
        resolve: {
            extensions: ['.js', '.vue', '.json'],
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
                '@': srcDir,
            },
            symlinks: false
        },
        module:{
            rules:[
                require('./vue-loader').loader,
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    include: [srcDir],
                    options: {
                        "presets": [
                            ["es2015", { "modules": false }]
                        ],
                        "plugins": [
                            "syntax-dynamic-import"
                        ]
                    }
                },
                ...resourceRules
            ]
        },
        plugins:[
            new webpack.optimize.CommonsChunkPlugin({
                name: Constant.SYSTEM_COMMON
            }),
            new webpack.optimize.ModuleConcatenationPlugin(),
            new ExtractTextPlugin({
                filename: assetsPath('css/[name].css')
            })
        ]
    };
    return _baseConfig;
}

module.exports = function(){
   var config = baseConfig();
   return merge(config,{
       module: {}
   });
};