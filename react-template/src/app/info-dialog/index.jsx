import { Application } from 'webapp-core';
import React from 'react';
import IframeComp from '../common-comp/iframe/comp';
Application.app('info-dialog', function () {
    this.name('对话框');
    this.route = {
        path:'/info-dialog',
        component:() => {
            return (
                <IframeComp url="core/base/info-dialog/example/index.html"/>
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