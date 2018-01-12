const Constant = require('../constant');
const webpack = require('webpack');
const MemoryFS = require("memory-fs");
const path = require('path');
//const fs = new MemoryFS();
const fs = require('fs');
const srcDir = path.resolve(__dirname,'../../src');
var config = require('../../build/webpack.dev.config.js');
const MIME = require('mime');
const compiler = webpack(config);
//compiler.outputFileSystem = fs;
compiler.run(function (err) {
    if(!err){
        compiler.watch({},function () {


        });
    }
});

var buildConfig = require('../build');
var appConfigMap = {};
var templateMap = {};
buildConfig.pages.forEach(function (page) {
    var envConfig = page.envConfig;
    if(envConfig){
        let relativePath = httpPath(envConfig);
        appConfigMap[relativePath] = page;
    }
    var template = page.template;
    if(template){
        let relativePath = httpPath(template);
        templateMap[relativePath] = page;
    }

});

function httpPath(absPath) {
    var relativePath = path.relative(srcDir,absPath);
    relativePath = relativePath.replace(/\\/g,'/');
    return relativePath;
}
function outputAppConf(response,pathname) {

    var page = appConfigMap[pathname];
    var json = fs.readFileSync(page.envConfig);
    var config = JSON.parse(json);

    delete config.main;
    delete config.init;
    response.outputContent(getMime(page.envConfig),JSON.stringify(config),null,4);
}
function outputTemplate(response,pathname) {
    var page = templateMap[pathname];
    var output = page.output;
    var filePath = path.resolve(output.path,page.templateFileName);
    var content = fs.readFileSync(filePath);
    response.outputContent(getMime(page.template),content);
}
function getMime(absPath) {
    var mime = MIME.lookup(path.basename(absPath));
    if (!mime) {
        mime = 'text/html';
    }
    return mime;
}
function outputStaticResource(response,absPath) {
    var mime = getMime(absPath);
    response.setHeader('Content-Type', mime);
    fs.createReadStream(absPath).pipe(response);
}
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

        if(!relativePath || relativePath.endsWith('/')){
            relativePath += 'index.html';
        }

        if(appConfigMap[relativePath]){
            outputAppConf(response,relativePath);
            return true;
        }
        if(templateMap[relativePath]){
            outputTemplate(response,relativePath);
            return true;
        }
        let filePath = path.resolve(srcDir,relativePath);
        if(fs.existsSync(filePath) && fs.statSync(filePath).isFile()){
            outputStaticResource(response,filePath);
            return true;
        }
    });
    if(!result){
        chain.next();
    }
}
function execute(chain,request,response) {
    output(chain,request,response);

}
execute.priority = -1;
exports.execute = execute;