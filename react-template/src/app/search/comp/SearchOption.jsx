import React, { Component } from 'react';
import { Application } from 'webapp-core';
class SearchOption extends Component{
    constructor(props){
        super(props);
        this._mounted = true;
        this.state = {
            attributes:{},
            mode:0,
            model:props.model,
            loginInfo:{
                userName:'loading...'
            }
        };
    }
    componentDidMount(){
        return;
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
        var model = this.state.model;
        loginService.getLoginInfo().then((loginInfo) => {
            if(!this._mounted){
                return;
            }
            model.name = 'rttt';
            this.setState({
                loginInfo:loginInfo,
                mode:1
            });
        });
    }
    componentWillUnmount(){
        this._mounted = false;
    }
    render(){
        return (
            <div className='search-option'>
                <span>{this.state.homepage}</span>:<span>{this.state.model.name}</span>
                {
                    this.state.mode === 0 ? <span>search app,current user:{this.state.loginInfo.userName}</span> :
                        <div style={{color:'red'}}><span>search app,current user:{this.state.loginInfo.userName}</span></div>
                }
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
export default SearchOption;