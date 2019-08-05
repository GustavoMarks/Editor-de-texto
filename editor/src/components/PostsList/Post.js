import React, { Component } from 'react';

class Post extends Component{

    componentDidMount(){
        document.getElementById("body").innerHTML = this.props.data.text;
    }

    render(){
        return(
            <div>
                <h1>{this.props.data.title}</h1>
                <div id="body">
                    carregando...
                </div>
            </div>
        )
    }
}

export default Post;