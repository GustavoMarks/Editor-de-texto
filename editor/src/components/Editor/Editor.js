import React, { Component } from 'react';

class Editor extends Component {

    /*
        State:
            - inputField: guarda campo dinâmico para inputs
            - urls: guarda inputs de url
    */

    state = {
        inputField: null,
        urls: "",
    }

    sandBox = () =>{

        let editor = document.getElementById("editor");
        console.log(editor.innerHTML);
        console.log(this.state.urls)
        //console.log(window.getSelection().getRangeAt(0))
    }

    //Função para manipular a fomatação html do campo de edição
    format = (commmand) =>{
        document.execCommand(commmand);
    }

    //Função para atribuir títulos html para trechos de texto no campo de edição
    titles = (width) =>{
        document.execCommand("heading", null, width);
    }

    //Função para atribuir hiperlink para texto
    linking = () =>{
        document.execCommand('CreateLink', false, this.state.urls);
    }

    //Função para controle de campos de inputs
    urlInput = (e) =>{
        this.setState({urls: e.target.value})
    }

    //Função para configurar campo de inputs para link, imagem ou vídeo
    changeInputField = (type) =>{
        if(type === "link"){
            let content = (
                <div>
                    <label htmlFor="url-input">URL:</label>
                    <input id="url-input" type="text" onChange={this.urlInput} value={this.setState.urls}/>

                    <button onClick={() => this.linking()}>Salvar</button>
                    <button onClick={() => this.setState({inputField: null})}>Cancelar</button>
                </div>
            );

            this.setState({inputField: content});
        } else if (type === "video"){
            let content = (
                <div>
                    <label htmlFor="url-input">YouTube URL:</label>
                    <input id="url-input" type="text" onChange={this.urlInput} value={this.setState.urls}/>

                    <button onClick={() => this.addVideo()}>Salvar</button>
                    <button onClick={() => this.setState({inputField: null})}>Cancelar</button>
                </div>
            );

            this.setState({inputField: content});
        }
    }

    //Função para adição de vídeo por ifram com link externo
    addVideo = () => {
        if(this.state.urls !== " "){
            let iframe = document.createElement("iframe");
            iframe.type = "text/html";
            iframe.height = "360";
            iframe.width = "80%";
            iframe.src= "https://www.youtube.com/embed/M7lc1UVf-VE?autoplay=0&origin="+this.state.urls;

            let range = window.getSelection().getRangeAt(0);
            range.insertNode(iframe);
        }
    }

    render(){
        return(
            <div>
                <div id="toolbar">
                    <button onClick={() => this.titles("h2")}>titulo 1</button>
                    <button onClick={() => this.titles("h3")}>titulo 2</button>
                    <button onClick={() => this.titles("h4")}>titulo 3</button>
                    <button onClick={() => this.format("bold")}>negrito</button>
                    <button onClick={() => this.format("italic")}>italico</button>
                    <button onClick={() => this.format("underline")}>sublinhado</button>
                    <button onClick={() => this.format("justifyFull")}>justificado</button>
                    <button onClick={() => this.format("justifyLeft")}>esquerda</button>
                    <button onClick={() => this.format("justifyCenter")}>central</button>
                    <button onClick={() => this.format("justifyRight")}>direita</button>
                    <button onClick={() => this.format("insertOrderedList")}>lista ordenada</button>
                    <button onClick={() => this.format("insertUnorderedList")}>lista não ordenada</button>
                    <button>imagem</button>
                    <button onClick={() => this.changeInputField("video")}>vídeo</button>
                    <button onClick={() => this.changeInputField("link")}>link</button>
                    <button onClick={() => this.format("unlink")}>remover link</button>
                    <button onClick={() => this.format("undo")}>desfazer</button>
                    <button onClick={() => this.format("redo")}>refazer</button>
                </div>

                {
                    this.state.inputField
                }

                <div contentEditable="true" designmode="on" id="editor" spellCheck="true"> 
                    digite aqui...
                </div>

                <button onClick={() => this.sandBox()}>sandBox</button>
            </div>
        )
    }

}

export default Editor;