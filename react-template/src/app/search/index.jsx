import { Application } from 'webapp-core';
import SearchComp from './comp/SearchComp';
Application.app('search', function () {
    this.route = {
        path:'/search',
        component:SearchComp,
        exact:true,
        strict:true
    };
    this.resource = {
        js:[],
        css:[]
    };
},[],'system');