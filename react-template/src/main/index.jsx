import { Module,Application,constant } from 'webapp-core';
import React from 'react';
import { render } from 'react-dom';
import { HashRouter,Route } from 'react-router-dom';
import { AsyncComp } from '../core/AsyncComp';
import { PageCompCreator } from './page/PageCompCreator';

function main() {
    var routes = [];
    function buildRoute(app){
        var routeOption = app.route;
        if(!routeOption.key){
            routeOption.key = routeOption.path;
        }
        var component = routeOption.component;
        routeOption.component = function () {
            var compFn = function (resolve) {
                app.load().then(function () {
                    resolve(component);
                });
            };
            return (
                <AsyncComp component={compFn}></AsyncComp>
            );
        };
        var route = React.createElement(Route,routeOption);
        return route;
    }
    Application.apps().forEach(function (app) {
        var route;
        if(app.route && app.route.path){
            route = buildRoute(app);
            routes.push(route);
        }
    });
    var PageComp = PageCompCreator(routes);
    var instance = render((
        <HashRouter>
            <PageComp></PageComp>
        </HashRouter>
    ), document.querySelector('#main-app'))
    constant('main',instance);
    return instance;
}
export default main;