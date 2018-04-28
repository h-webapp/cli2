import { Module,Application,constant } from 'webapp-core';
import React from 'react';
import { render } from 'react-dom';
import { HashRouter,Router,Switch } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory'

function main() {
    var routes = [];
    function buildRoute(routeOption){
        var route = {};
        route.path = routeOption.path;
        route.name = routeOption.name;
        route.redirect = routeOption.redirect;
        route.component = routeOption.component;
        if(routeOption.children && routeOption.children.length > 0){
            route.childRoutes = routeOption.children.map(function (child) {
                return buildRoute(child);
            });
        }
        return route;
    }
    Application.apps().forEach(function (app) {
        var route;
        if(app.route && app.route.path){
            route = buildRoute(app.route);
            route.onEnter = function (next) {
                app.load().then(function () {
                    next();
                });
            };
            routes.push(route);
        }
    });
    var Comp = <div>test</div>;
    const history = createBrowserHistory();
    
    var instance = render((
        <HashRouter>
            <Switch>
                <Router histor={history} path='/' component={Comp}></Router>
            </Switch>
        </HashRouter>
    ), document.querySelector('#main-app>.content'))
    constant('main',instance);
    return instance;
}
export default main;