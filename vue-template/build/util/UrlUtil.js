const path = require('path');
var contextDir = path.resolve(__dirname,'../../');
function isAbsoluteUrl(src){
    return /^(https*|file):\/\//.test(src);
}
function isNodeModuleUrl(src){
    return /^\/node_modules\b/.test(src);
}
function extractUrl(dir,src){

    if(isAbsoluteUrl(src)){
        return src;
    }else if(isNodeModuleUrl(src)){
        src = path.resolve(contextDir,src.replace(/^\/+/g,''));
    }else{
        src = path.resolve(dir,src);
    }
    return src;
}
function parseFileType(file){
    if(/\.js$/.test(file)){
        return 'js';
    }
    if(/\.css$/.test(file)){
        return 'css';
    }
}
exports.isAbsoluteUrl = isAbsoluteUrl;
exports.isNodeModuleUrl = isNodeModuleUrl;
exports.extractUrl = extractUrl;
exports.parseFileType = parseFileType;