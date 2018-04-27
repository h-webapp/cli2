var ExtractTextPlugin = require('extract-text-webpack-plugin')
function cssLoaders() {
    return {
        scss: ExtractTextPlugin.extract({
            use: 'css-loader!sass-loader',
            fallback: 'vue-style-loader'
        }),
        css: ExtractTextPlugin.extract({
            use: 'css-loader',
            fallback: 'vue-style-loader'
        })
    };
}

exports.loader = {
    test: /\.vue$/,
    loader: 'vue-loader',
    options: {
        loaders:cssLoaders(),
        extractCSS:true,
        transformToRequire: {
            video: ['src', 'poster'],
            source: 'src',
            img: 'src',
            image: 'xlink:href'
        }
    }
};
