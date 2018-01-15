import { Module,Application,define } from 'webapp-core';
import { ApplicationExtend } from './application-extend';
import { Promise } from 'promise-deferred-sim';
import Vue from 'vue'

if(!window.Promise){
    window.Promise = HERE.$Promise;
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
window.Vue = Vue;
initVariable('Vue',Vue);
initVariable('HERE.FRAMEWORK.Module',Module);
initVariable('HERE.FRAMEWORK.Application',Application);