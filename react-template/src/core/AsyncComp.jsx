import React from "react";
export class AsyncComp extends React.Component{
    constructor(props){
        super(props);
        this.component = null;
        this.state = {
            loaded:false
        };
    }
    resolve(component){
        if(typeof component === 'function'){
            this.component = React.createElement(component);
        }else{
            this.component = component;
        }
        this.setState({
            loaded:true
        });
    }
    componentDidMount(){
        var resolve = this.resolve.bind(this);
        var componentFn = this.props.component;
        if(typeof componentFn === 'function'){
            componentFn(resolve);
        }
    }
    render(){
        return this.component;
    }
}