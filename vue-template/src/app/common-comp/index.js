import { Application } from 'webapp-core';
Application.app('common-comp', function () {
    this.resource = {
        js:['component/iframe.comp.js'],
        css:['component/iframe.comp.css']
    };
    this.name('公共组件');
},[]);