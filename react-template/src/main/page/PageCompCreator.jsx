import React from 'react';
import { Switch,NavLink } from 'react-router-dom';
import styles from './PageComp.css';
export function PageCompCreator(routes){
    return function render() {
        return (
            <div className="page">
                <nav className="nav">
                    <NavLink to="/search" activeClassName="select">search</NavLink>
                    <NavLink to="/cube-search" activeClassName="select">cube-search</NavLink>

                    <NavLink to="/browse" activeClassName="select">浏览</NavLink>
                    <NavLink to="/info-dialog" activeClassName="select">提示对话框</NavLink>

                    <NavLink to="/menu" activeClassName="select">环形菜单</NavLink>
                    <NavLink to="/analysis" activeClassName="select">依赖关系</NavLink>

                    <div>
                        <a target="_blank" href="core/base/annular-menu/example/index.html">menu Demo</a>
                        <a target="_blank" href="core/base/annular-menu/example/index-default.html">menu Demo(default)</a>
                        <a target="_blank" href="sys/index.html">structure</a>
                    </div>
                </nav>
                <div className="content">
                    <Switch>
                        {routes}
                    </Switch>
                </div>
            </div>
        );
    }
}
