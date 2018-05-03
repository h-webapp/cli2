import { Application } from 'webapp-core';
import React from 'react';
import IframeComp from '../common-comp/iframe/comp';
Application.app('analysis', function () {
    this.name('分析');
    this.route = {
        path:'/analysis',
        component:() => {
            return (
                <IframeComp url="sys/index.html"/>
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