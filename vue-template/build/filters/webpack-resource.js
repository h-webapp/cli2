const webpack = require('webpack');
const MemoryFS = require("memory-fs");
const path = require('path');
const fs = new MemoryFS();
const srcDir = path.resolve(__dirname,'../../src');
var config = require('../../build/webpack.dev.config.js');
const compiler = webpack(config);
//compiler.outputFileSystem = fs;
compiler.watch({},function () {


});
var buildConfig = require('../build');
var templateMap = {};
buildConfig.pages.forEach(function (page) {
    var template = page.template;
    if(!template){
        return;
    }
    var output = page.output;
    templateMap[path.relative(srcDir,template)] = path.resolve(output.path,page.templateFileName);

});
console.log(templateMap);
function output(chain,request,response) {
    var pathname = request.pathname;
    var config = request.getContextConfig();
    var result = config.docBase.some(function (doc) {
        const contextPath = (doc.path || config.path || '/');
        if(!pathname.startsWith(contextPath)){
            return;
        }
        let relativePath = pathname.substring(contextPath.length);
        relativePath = relativePath.replace(/^\//g,'');
        if(templateMap[relativePath]){

            response.outputStaticResource(templateMap[relativePath]);
            return true;
        }
        let filePath = path.resolve(srcDir,relativePath);
        if(fs.existsSync(filePath)){
            response.outputStaticResource(filePath);
            return true;
        }
    });
    if(!result){
        chain.next();
    }
}
exports.execute = output;