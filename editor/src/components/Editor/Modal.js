import React, { Component } from 'react';
import './Editor.css';

class Modal extends Component {

    //Estado manipula a visibilidade do modal
    state = {
        actived: this.props.actived,
    }

    //Alterna a visibilidade do modal
    change = () =>{
        this.setState({
            actived: this.state.actived ? false : true,
        })
    }

    render(){
        return(
            <div className="editor-modal-glass" style={{display: this.state.actived ? "flex" : "none"}}>
                <span className="editor-modal-closer" onClick={() => this.change()}>X</span>
                <div className="editor-modal-container">
                    {this.props.children}
                </div>
            </div>
        )
    }

    componentDidMount(){
        //Adicionando listenter para modal ser fechado ao pressionar enter
        window.addEventListener('keydown', (e) => {
            if(e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27){
                if(this.state.actived)
                    this.change();
            }
        })

        //Lista de ids passada por props, adcionando listener para cada um dos a ids para elementos acionanrem o modal
        let listenersList = this.props.listenersId

        if(listenersList){
            listenersList.forEach((id) => {
                let element = document.getElementById(id);
                if(element){
                    element.addEventListener("click", () =>{
                        this.change();
                    }) 
                }
                
            })
        }
    }
}

export default Modal;