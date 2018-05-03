import React, { Component } from 'react';
import { Application } from 'webapp-core';
import styles from './comp.css';
class IframeComp extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <iframe className="custom-iframe" src={this.props.url}></iframe>
        );
    }
}
export default IframeComp;