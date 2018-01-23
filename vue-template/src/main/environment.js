import { Module,Application,ResourceLoader,Register } from 'webapp-core';
var body = document.body;
var loadingTimeout,loadingCount = 0;
function isResource(data){
    return /\.(js|css|json)$/.test(data && data.url);
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
function LoadEnvironment(configPath) {
    var register = Register.getInstance();
    return ResourceLoader.load({
        type:'json',
        urls:[configPath]
    }).then(function (dataArray) {
        var data = dataArray[0];
        var modules = [],_modules = [],apps = [],_apps = [];
        data.modules.forEach(function (m) {
            if(m.compile === false){
                modules.push(m);
            }else{
                _modules.push(m);
            }
            return m.compile === false;
        });
        data.apps.forEach(function (app) {
            if(app.compile === false){
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
            return data;
        });
    });
};
export default LoadEnvironment;