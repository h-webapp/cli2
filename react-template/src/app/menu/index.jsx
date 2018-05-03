import { Application } from 'webapp-core';
import React from 'react';
import IframeComp from '../common-comp/iframe/comp';
Application.app('menu', function () {
    this.name('环形菜单');
    this.route = {
        path:'/menu',
        component:() => {
            return (
                <IframeComp url="core/base/annular-menu/example/index.html"/>
            );
        },
        exact:true,
        strict:true
    };
    this.resource = {
        js:[],
        css:[]
    };
},[],'common-comp');