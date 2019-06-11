const path = require('path');
const fs = require('fs');
const srcDir = require('../util/SrcDir').get();
const MIME = require('mime');
const buildConfig = require('../build.config');
const webpackRunner = require('./webpack-runner');
const pendingFile = path.resolve(__dirname,'./pending.html');
const templateMap = {};
buildConfig.pages.forEach(function (page) {
    const template = page.template;
    if(template){
        let relativePath = httpPath(template);
        templateMap[relativePath] = page;
    }

});

function httpPath(absPath) {
    let relativePath = path.relative(srcDir, absPath);
    relativePath = relativePath.replace(/\\/g,'/');
    return relativePath;
}
function outputTemplate(response,pathname) {
    const page = templateMap[pathname];
    const output = buildConfig.output;
    const filePath = path.resolve(output.path, pathname);
    const content = readFileSync(filePath);
    response.outputContent(getMime(page.template),content);
}
function getMime(absPath) {
    let mime = MIME.getType(path.basename(absPath));
    if (!mime) {
        mime = 'text/html';
    }
    return mime;
}
function outputStaticResource(response,absPath) {
    const mime = getMime(absPath);
    response.setHeader('Content-Type', mime);
    createReadStream(absPath).pipe(response);
}
function readFileSync(filePath) {
    const fs = isFile(filePath);
    return fs.readFileSync(filePath);
}
function createReadStream(absPath) {
    const fs = isFile(absPath);
    return fs.createReadStream(absPath);
}
function isFile(filePath) {
    const _fs = webpackRunner.getFs();
    if(_fs && _fs.existsSync(filePath) && _fs.statSync(filePath).isFile()){
        return _fs;
    }
    if(fs.existsSync(filePath) && fs.statSync(filePath).isFile()){
        return fs;
    }
    return null;
}
function output(chain,request,response) {
    const pathname = request.pathname;
    const config = request.getContextConfig();
    const result = config.docBase.some(function (doc) {
        const contextPath = (doc.path || config.path || '/');
        if (!pathname.startsWith(contextPath)) {
            return;
        }
        let relativePath = pathname.substring(contextPath.length);
        relativePath = relativePath.replace(/^\//g, '');

        if (!relativePath || relativePath.endsWith('/')) {
            relativePath += 'index.html';
        }

        if (templateMap[relativePath]) {
            outputTemplate(response, relativePath);
            return true;
        }
        let filePath = path.resolve(srcDir, relativePath);
        if (isFile(filePath)) {
            outputStaticResource(response, filePath);
            return true;
        }
    });
    if(!result){
        chain.next();
    }
}
function execute(chain,request,response) {
    if(webpackRunner.isFinished()){
        output(chain,request,response);
    }else{
        outputStaticResource(response,pendingFile);
    }
}
execute.priority = -2;
exports.execute = execute;