const path = require('path');
const webpack = require('webpack');
const Constant = require('./constant');
const srcDir = path.resolve(__dirname,'../src');
var ExtractTextPlugin = require('extract-text-webpack-plugin')
module.exports = function () {
    var baseConfig = {
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
                require('./vue-loader-option').loaders,
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
            })
        ]
    };
    return baseConfig;
};