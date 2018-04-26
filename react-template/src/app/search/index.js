import { Application } from 'webapp-core';
Application.app('search', function () {
    this.route = {
        path:'/search',
        component:{
            template:'<search-comp/>'
        }
    };
    this.resource = {
        js:[],
        css:[]
    };
},[],'system');