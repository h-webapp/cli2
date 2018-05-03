import React, { Component } from 'react';
import { Application } from 'webapp-core';
class CubeSearchComp extends Component{
    constructor(props){
        super(props);
        this._mounted = true;
        this.state = {
            homepage:null,
            loginInfo:{
                userName:'loading-cube...'
            }
        };
    }
    componentDidMount(){
        var app = Application.app('cube-search');
        var loginService = app.getService('loginService');
        var langService = app.getService('language');
        var homepage = langService.getLangText('homepage');
        this.setState({
            homepage:homepage
        });
        loginService.getLoginInfo().then((loginInfo) => {
            if(!this._mounted){
                return;
            }
            this.setState({
                loginInfo:loginInfo
            });
        });
    }
    componentWillUnmount(){
        this._mounted = false;
    }
    render(){
        return (
            <div>
                <span>{ this.state.homepage }</span>-cube search app,current user:{ this.state.loginInfo.userName }
            </div>
        )
    }
}
export default CubeSearchComp;