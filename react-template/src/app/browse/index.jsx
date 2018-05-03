import { Application } from 'webapp-core';
import BrowseComp from './comp/BrowseComp';
Application.app('browse', function () {
    this.name('浏览');
    this.route = {
        path:'/browse',
        component:BrowseComp,
        exact:true,
        strict:true
    };
    this.resource = {
        js:[],
        css:[]
    };
},[],'system');