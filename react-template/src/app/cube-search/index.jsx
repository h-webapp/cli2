import { Application } from 'webapp-core';
import CubeSearchComp from './comp/CubeSearchComp';
Application.app('cube-search', function () {
    this.route = {
        path:'/cube-search',
        component:CubeSearchComp,
        exact:true,
        strict:true
    };
    this.resource = {
        js:[],
        css:[]
    };
},[],'search');