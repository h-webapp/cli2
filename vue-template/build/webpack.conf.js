const path = require('path');
const webpack = require('webpack');
const Constant = require('./constant');
const srcDir = path.resolve(__dirname,'../src');
var ExtractTextPlugin = require('extract-text-webpack-plugin')
module.exports = {
    context:__dirname + '/src',
    module:{
        rules:[
            {
                test:/\.css$/,
                use:[
                    'style-loader',
                    'css-loader',

                ]
            },
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