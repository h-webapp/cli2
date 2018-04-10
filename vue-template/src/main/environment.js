import { Module,Application,ResourceLoader,Register } from 'webapp-core';
var body = document.body;
var loadingTimeout,loadingCount = 0;
var a;
function isAbsoluteUrl(src){
    return /^(https*|file):\/\//i.test(src);
}
function isResource(data){
    if(!a){
        a = document.createElement('a');
    }
    a.href = data && data.url;
    return /\.(js|css|json)$/.test(a.pathname);
}
var deferTime = 300;
ResourceLoader.addEventListener('loadStart', function (e) {
    if(!isResource(e)){
        return;
    }
    loadingCount++;
    if(loadingTimeout){
        clearTimeout(loadingTimeout);
    }
    loadingTimeout = setTimeout(function () {
        body.setAttribute('loading-resource','true');
    },deferTime);
});
ResourceLoader.addEventListener('loadFinished', function (e) {
    if(!isResource(e)){
        return;
    }
    loadingCount--;
    if(loadingCount === 0){
        clearTimeout(loadingTimeout);
        loadingTimeout = setTimeout(function () {
            body.setAttribute('loading-resource','false');
        },deferTime);
    }
});
function preLoad(){
    var slice = Array.prototype.slice;
    var resources = slice.call(document.querySelectorAll('resource[pre-url]'));
    var resource = {
        js:[],
        css:[]
    };
    var timeout;
    var unUsedNodes = [];
    function removeNodes(){

        unUsedNodes.forEach(function (node) {
            if(node.remove){
                return node.remove();
            }else if(node.parentNode){
                node.parentNode.removeChild(node);
            }
        });
    }
    function removeNode(node){
        unUsedNodes.push(node);
        if(timeout){
            clearTimeout(timeout);
        }
        timeout = setTimeout(removeNodes,10);
    }
    resources.forEach(function (el) {
        var src = el.getAttribute('pre-url');
        var type = el.getAttribute('type');
        if(!resource[type]){
            return;
        }
        resource[type].push(src);
        removeNode(el);
    });

    ResourceLoader.load([
        {
            type:'js',
            urls:resource.js
        },
        {
            type:'css',
            urls:resource.css
        }
    ]);
}
setTimeout(preLoad);
function dirName(file) {
    var index = file.lastIndexOf('/');
    return file.substring(0,index);
}
function initModuleLoaderBaseURI(modules) {
    modules.forEach(function (module) {
        Module.module(module.name).loader().baseURI(dirName(module.url));
    });
}
function initApplicationLoaderBaseURI(apps) {
    apps.forEach(function (app) {
        Application.app(app.name).loader().baseURI(dirName(app.url));
    });
}
function initEnvironment(data){
    if(!Module.has('env')){
        return;
    }
    var environment = Module.module('env').getService('environment');
    environment.updateEnvironment(data);
}
function isNeedLoad(declare){
    if(isAbsoluteUrl(declare.url)){
        return true;
    }
    return declare.compile === false;
}
function processEnvironmentData(data) {
    var register = Register.getInstance();
    var modules = [],_modules = [],apps = [],_apps = [];
    data.modules.forEach(function (m) {
        if(isNeedLoad(m)){
            modules.push(m);
        }else{
            _modules.push(m);
        }
        return m.compile === false;
    });
    data.apps.forEach(function (app) {
        if(isNeedLoad(app)){
            apps.push(app);
        }else{
            _apps.push(app);
        }
    });
    register.modules(modules);
    register.apps(apps);
    return register.register().then(function () {
        initModuleLoaderBaseURI(_modules);
        initApplicationLoaderBaseURI(_apps);
        initEnvironment(data);
        return data;
    });
}
function loadEnvironmentScript(configScriptPath) {
    return ResourceLoader.load({
        type:'text',
        urls:[configScriptPath]
    }).then(function (dataArray) {
        var script = dataArray[0];
        var module = {};
        Function('module',script)(module);
        return processEnvironmentData(module.exports);
    });
}
function LoadEnvironmentJson(configPath) {
    return ResourceLoader.load({
        type:'json',
        urls:[configPath]
    }).then(function (dataArray) {
        var data = dataArray[0];
        return processEnvironmentData(data);
    });
}
function LoadEnvironment(configPath,type) {
    if(type === 'json' || /\.json$/i.test(configPath)){
        return LoadEnvironmentJson(configPath);
    }else if(type === 'js' || /\.js$/i.test(configPath)){
        return loadEnvironmentScript(configPath);
    }
    throw new TypeError('config type is invalid !');
}
export default LoadEnvironment;