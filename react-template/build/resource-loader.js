var ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
var config = require('./build.config');
function assetsPath(_path){
    return path.posix.join(config.resourceDir, _path);
}
exports.rules = [
    {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
            limit: 10000,
            name: assetsPath('images/[name].[hash:7].[ext]')
        }
    },
    {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
            limit: 10000,
            name: assetsPath('fonts/[name].[hash:7].[ext]')
        }
    },
    {
        test: /\.json$/,
        loader: 'json-loader'
    },
    {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader', 'sass-loader'] })
    },
    {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' })
    }
];