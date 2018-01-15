import { Application } from 'webapp-core';
import TestComp from './js/test';
Application.app('test-app',function () {
    this.route = {
        path:'/test',
        component:TestComp
    };
});