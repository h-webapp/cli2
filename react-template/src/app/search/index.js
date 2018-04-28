import { Application } from 'webapp-core';
import SearchComp from './comp/search-comp';
Application.app('search', function () {
    this.route = {
        path:'/search',
        component:SearchComp
    };
    this.resource = {
        js:[],
        css:[]
    };
},[],'system');