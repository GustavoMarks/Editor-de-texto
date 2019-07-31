import React, { Component } from 'react';

class Editor extends Component {

    render(){
        return(
            <div>
                <div contenteditable="true"> teste <b>teste</b> </div>
            </div>
        )
    }

}

export default Editor;