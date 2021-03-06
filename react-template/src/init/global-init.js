import { Module,Application,define,constant,Loader,ResourceLoader } from 'webapp-core';
import { $Promise } from 'promise-deferred-sim';

var versionConfig = require('../../build/version/version');
Loader.GlobalParam = Loader.GlobalParam || {};
Loader.GlobalParam.version = versionConfig.version;
if(!window.Promise){
    window.Promise = $Promise;
}
function initVariable(name,value) {
    var names = name.split('.');
    name = names.pop();
    var sep;
    var object = window;
    while((sep = names.shift())){
        if(!object[sep]){
            object = object[sep] = {};
        }else{
            object = object[sep];
        }
    }
    object[name] = value;
}
initVariable('HERE.FRAMEWORK.Module',Module);
initVariable('HERE.FRAMEWORK.Application',Application);
initVariable('HERE.FRAMEWORK.ResourceLoader',ResourceLoader);
initVariable('HERE.FRAMEWORK.Loader',Loader);
initVariable('HERE.FRAMEWORK.define',define);
initVariable('HERE.FRAMEWORK.constant',constant);