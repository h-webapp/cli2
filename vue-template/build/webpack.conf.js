const path = require('path');
const webpack = require('webpack');
var merge = require('webpack-merge')
const Constant = require('./constant');
const srcDir = path.resolve(__dirname,'../src');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');


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
                {
                    test:/\.css$/,
                    use:[
                        'style-loader',
                        'css-loader',

                    ]
                },
                require('./vue-loader').loader,
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    include: [srcDir],
                    options: {
                        "babelrc": false,
                        "presets": [
                            ["es2015", { "modules": false }]
                        ],
                        "plugins": [
                            "syntax-dynamic-import"
                        ]
                    }
                }
            ]
        },
        plugins:[
            new webpack.optimize.CommonsChunkPlugin({
                name: Constant.SYSTEM_COMMON
            }),
            new webpack.optimize.ModuleConcatenationPlugin(),
            new ExtractTextPlugin({
                filename: 'css/[name].css'
            }),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new FriendlyErrorsPlugin()
        ]
    };
    return _baseConfig;
}

module.exports = function(){
   var config = baseConfig();
   return merge(config,{
       module: {
           rules: require('./css-loader').loaders
       }
   });
};