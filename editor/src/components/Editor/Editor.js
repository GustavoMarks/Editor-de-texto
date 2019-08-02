import React, { Component } from 'react';

class Editor extends Component {

    sandBox = () =>{

        let editor = document.getElementById("editor");
        document.execCommand("heading", null, "h1");

        console.log(editor.innerHTML);
        //console.log(window.getSelection().getRangeAt(0));

    }

    format = (commmand) =>{
        document.execCommand(commmand);
    }

    titles = (width) =>{
        document.execCommand("heading", null, width);
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
                    <button>vídeo</button>
                    <button>link</button>
                    <button onClick={() => this.format("undo")}>desfazer</button>
                    <button onClick={() => this.format("redo")}>refazer</button>
                </div>

                <div contentEditable="true" designmode="on" id="editor" spellCheck="true"> digite aqui... </div>

                <button onClick={() => this.sandBox()}>sandBox</button>
            </div>
        )
    }

}

export default Editor;