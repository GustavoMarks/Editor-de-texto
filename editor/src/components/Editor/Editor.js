import React, { Component } from 'react';

class Editor extends Component {

    sandBox = () =>{
        //console.log(window.getSelection().type);

        let element = document.createElement("b");
        element.innerHTML = " ";

        if(window.getSelection().type === 'Caret'){
            window.getSelection().getRangeAt(0).insertNode(element);
        } else {
            //window.getSelection().getRangeAt(0).surroundContents(element);
            console.log(window.getSelection().getRangeAt(0).endContainer.parentNode.localName);

        }
    }

    format = (tag) =>{
        /*
            Criando tag de formatação
            b: negrito
            strong: realçado
            i: itálico
            em: ênfase
            mark: marcado
            small: pequeno
            del: riscado
            ins: sublinhado
            sub: subscrito
            sup: subrescrito
            hx (1-4): título
        */
        let element = document.createElement(tag);
        element.innerHTML = " ";

        //Intervalo ou ponto selecionado no editor:
        let sel = window.getSelection();

        //Chegando seleção é tipo cursor ou intervalo
        if(sel.type === 'Caret'){
            //Inserindo novo elemento dentro da área selecionada
            window.getSelection().getRangeAt(0).insertNode(element);
        } else {
            //tipo intervalo
            //Área selecionada já possui a formatação passada no parâmetro
            if(sel.getRangeAt(0).endContainer.parentNode.localName === tag){
                //Removendo formatação

            } else {
                //Inserindo tag em volta do intervalo selecionado para formatação.
                sel.getRangeAt(0).surroundContents(element);
            }
            
        }

    }

    render(){
        return(
            <div>
                <div id="toolbar">
                    <button onClick={() => this.format("h2")}>titulo 1</button>
                    <button onClick={() => this.format("h3")}>titulo 2</button>
                    <button onClick={() => this.format("h4")}>titulo 3</button>
                    <button onClick={() => this.format("b")}>negrito</button>
                    <button onClick={() => this.format("i")}>italico</button>
                    <button onClick={() => this.format("ins")}>sublinhado</button>
                    <button>justificado</button>
                    <button>esquerda</button>
                    <button>central</button>
                    <button>direita</button>
                    <button>lista ordenada</button>
                    <button>lista não ordenada</button>
                    <button>imagem</button>
                    <button>vídeo</button>
                </div>

                <div contentEditable="true" designmode="on" id="editor" spellCheck="true"> digite aqui... </div>

                <button onClick={() => this.sandBox()}>sandBox</button>
            </div>
        )
    }

}

export default Editor;