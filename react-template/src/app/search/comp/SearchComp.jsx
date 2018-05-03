import React, { Component } from 'react';
import { Application } from 'webapp-core';
class SearchComp extends Component{
    constructor(props){
        super(props);
        this._mounted = true;
        this.state = {
            attributes:{},
            loginInfo:{
                userName:'loading...'
            }
        };
    }
    componentDidMount(){
        var app = Application.app('search');
        var loginService = app.getService('loginService');
        var userService = app.getService('userService');
        var env = app.getService('environment');
        var homepage = userService.getHomepage();
        var attributes = env.attributes();
        this.setState({
            homepage:homepage,
            attributes:attributes
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
                <span>{this.state.homepage}</span>:<span>search app,current user:{this.state.loginInfo.userName}</span>
                <ul>
                    {
                        Object.keys(this.state.attributes).map((key) =>{
                            return (
                                <li key={key}>
                                    {key}:
                                    {this.state.attributes[key]}
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
        )
    }
}
export default SearchComp;