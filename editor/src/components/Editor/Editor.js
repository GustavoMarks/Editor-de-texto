import React, { Component } from 'react';

class Editor extends Component {

    /*
        State:
            - inputField: guarda campo dinâmico para inputs
            - urls: guarda inputs de url
            - imageWidth: guarda valores (%) para dimensão de largura de imagem a ser inserida (default 20)
            - imageHeight: guarda valores (%) para dimensão de altura de imagem a ser inserida (default 20)
    */

    state = {
        inputField: null,
        urls: "",
        imageWidth: 20,
        imageHeight: 20,
        imageFile: null,
    }

    sandBox = () =>{

        let editor = document.getElementById("editor");
        console.log(editor.innerHTML);
        console.log(this.state)
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
    inputs = (e) =>{

        //Caso de upload de arquivo
        if(e.target.files[0]){
            this.setState({[e.target.name]: e.target.files[0]})
        } else {
            this.setState({[e.target.name]: e.target.value})
        }
        
    }

    //Função para configurar campo de inputs para link, imagem ou vídeo
    changeInputField = (type) =>{
        //Caso em que botão de link foi clicado
        if(type === "link"){
            //Gerando campo com inputs e salvando no state para renderização
            let content = (
                <div>
                    <label htmlFor="url-input">URL:</label>
                    <input name="urls" id="url-input" type="text" onChange={this.inputs} value={this.setState.urls}/>

                    <button onClick={() => this.linking()}>Salvar</button>
                    <button onClick={() => this.setState({inputField: null})}>Cancelar</button>
                </div>
            );

            this.setState({inputField: content});
        } else if (type === "video"){
            //Caso em que botão de video foi clicado
            //Gerando campo com inputs e salvando no state para renderização
            let content = (
                <div>
                    <label htmlFor="url-input">YouTube URL:</label>
                    <input name="urls" id="url-input" type="text" onChange={this.inputs} value={this.setState.urls}/>

                    <button onClick={() => this.addVideo()}>Salvar</button>
                    <button onClick={() => this.setState({inputField: null})}>Cancelar</button>
                </div>
            );

            this.setState({inputField: content});
        } else if (type === "image"){
            //Caso em que botão de imagem foi clicado
            //Gerando campo com seleção para imagem por url ou uplad
            let content = (
                <div>   
                    <button onClick={() => this.changeInputField("urlImage")}>Imagem url</button>
                    <button onClick={() => this.changeInputField("uploadImage")}>Imagem upload</button>
                    <button onClick={() => this.setState({inputField: null})}>Cancelar</button>
                </div>
            );

            this.setState({inputField: content});
        } else if (type === "urlImage"){
            //Caso em que subopção de imagem por url foi escolhida
            //Gerando campo com inputs e salvando no state para renderização
            let content = (
                <div>
                    <label htmlFor="url-input">URL:</label>
                    <input name="urls" id="url-input" type="text" onChange={this.inputs} value={this.setState.urls}/>

                    <label htmlFor="width-input">Lagura:</label>
                    <input name="imageWidth" id="width-input" type="number" onChange={this.inputs} value={this.setState.imageWidth}/>

                    <label htmlFor="height-input">Altura:</label>
                    <input name="imageHeight" id="height-input" type="number" onChange={this.inputs} value={this.setState.imageHeight}/>

                    <button onClick={() => this.addUrlImage()}>Salvar</button>
                    <button onClick={() => this.setState({inputField: null})}>Cancelar</button>
                </div>
            );

            this.setState({inputField: content});
        } else if (type === "uploadImage"){
            //Caso em que subopção de imagem por upload foi escolhida
            //Gerando campo com inputs e salvando no state para renderização
            let content = (
                <div>
                    <label htmlFor="upload-input">Escolha um aquivo no computador:</label>
                    <input id="upload-input" type="file" accept="image/x-png,image/gif,image/jpeg" name="imageFile" onChange={this.inputs}/>

                    <label htmlFor="width-input">Lagura:</label>
                    <input name="imageWidth" id="width-input" type="number" onChange={this.inputs} value={this.setState.imageWidth}/>

                    <label htmlFor="height-input">Altura:</label>
                    <input name="imageHeight" id="height-input" type="number" onChange={this.inputs} value={this.setState.imageHeight}/>

                    <button onClick={() => this.addUploadImage()}>Salvar</button>
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

    //Função para adicionar imagem por url
    addUrlImage = () => {
        this.createImage(this.state.urls);
    }

    //Função para adicionar imagem por upload
    addUploadImage = async () => {
        //Recebendo aquivo do input
        if(this.state.imageFile){
            //Gerando key para o arquivo
            let key = new Date().getTime();

            //Enviando imagem, key e callback para gerar imagem
            this.props.postImg(this.state.imageFile, key, this.createImage);

        }
    }

    //Função para criar um elemento img no campo de edição
    createImage = (url) => {
        console.log("creating image")
        if(url){
            let img = document.createElement("img");
            img.src = url;
            img.style.width = this.state.imageWidth + "%";
            img.style.height = this.state.imageHeight + "%";

            let range = window.getSelection().getRangeAt(0);
            range.insertNode(img);
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
                    <button onClick={() => this.changeInputField("image")}>imagem</button>
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