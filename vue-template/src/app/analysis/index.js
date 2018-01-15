import { Application } from 'webapp-core';
Application.app('analysis', function () {
    this.route = {
        path:'/analysis',
        component:{
            template:'<iframe-comp url="sys/index.html"/>'
        }
    };
    this.resource = {
        js:[],
        css:[]
    };
    this.name('分析');
},[],['system','common-comp']);
export default function () {
    return Application.app('analysis');
}