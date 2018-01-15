
var ExtractTextPlugin = require('extract-text-webpack-plugin')

function createLoaders(type,options) {
    options = options || {}
    var cssLoader = {
        loader: 'css-loader',
        options: {
            minimize: process.env.NODE_ENV === 'production',
            sourceMap: options.sourceMap
        }
    };
    var loaders = [cssLoader];
    if(type){
        loaders.push({
            loader: type + '-loader',
            options: Object.assign({}, options, {
                sourceMap: options.sourceMap
            })
        });
    }
    if(options['extract']){
        return ExtractTextPlugin.extract({
            use: loaders,
            fallback: 'vue-style-loader'
        });
    }
    loaders.push('vue-style-loader');
    return loaders;
}
function cssLoaders() {

    var options = {}

    return {
        css: createLoaders('',options),
        less: createLoaders('less',options),
        sass: createLoaders('sass', Object.assign({indentedSyntax: true},options)),
        scss: createLoaders('sass',options),
        stylus: createLoaders('stylus',options),
        styl: createLoaders('stylus',options)
    }
}

function styleLoaders(options) {
    var output = []
    var loaders = cssLoaders(options)
    for (var extension in loaders) {
        var loader = loaders[extension]
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            use: loader
        })
    }
    return output
}

exports.loaders = {
    test: /\.vue$/,
    loader: 'vue-loader',
    options: cssLoaders()
};
