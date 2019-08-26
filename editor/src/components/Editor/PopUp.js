import React, { Component } from 'react';
import './Editor.css';

class PopUp extends Component{
    state = {
        visibility: this.props.visibility,
        warning: this.props.warning
    }

    render() {
        return(
            <div className={this.state.warning ? "popup-waring" : "popup"} style={this.state.visibility ? visibleStyle : invisibleStyle}>

                {this.props.children}

                <span>
                    <button onClick={() => this.setState({visibility: false})}>
                        x
                    </button>
                </span>
            </div>
        )
    }
}

export default PopUp;


const invisibleStyle = {
    display: "none"
}

const visibleStyle = {
    display: "block"
}