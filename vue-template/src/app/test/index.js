import { Application } from 'webapp-core';
Application.app('test-app',function () {

    this.route = {
        path:'/test',
        component:function (resolve) {
            import('./js/test').then(resolve);
        }
    };
});