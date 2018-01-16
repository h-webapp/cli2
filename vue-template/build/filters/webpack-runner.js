
var config = require('../../build/webpack.dev.config.js');
const webpack = require('webpack');
const MemoryFS = require("memory-fs");
//const fs = new MemoryFS();
const compiler = webpack(config);
//compiler.outputFileSystem = fs;
compiler.run(function (err) {
    if(!err){
        compiler.watch({
            aggregateTimeout:300
        },function (err) {

        });
    }
});

exports.compiler = compiler;