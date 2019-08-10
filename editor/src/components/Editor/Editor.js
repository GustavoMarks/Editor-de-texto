import React, { Component } from 'react';
import Toolbar from './Toolbar';
import './Editor.css';

class Editor extends Component {

    /*
        State:
            - inputField: guarda campo dinâmico para inputs
            - urls: guarda inputs de url
            - imageWidth: guarda valores (%) para dimensão de largura de imagem a ser inserida (default 20)
            - imageHeight: guarda valores (%) para dimensão de altura de imagem a ser inserida (default 20)
            - imageFile: guarda arquivo de imagem para upload
            - title: guarda valor de titulo para post da publicação (default titulo-{numero randomico})

        Métodos:
            - format: recebe uma string de comando para aplicar formatação via DOM (com função nativa)
            - titles: recebe uma string com tamanho do título a ser aplicado e trata casos de formatação
            - linking: aplica formtação de link com url do state
            - inputs: recebe evento e manibula dados de inputs para o state
            - changeInputField: recebe uma string que determina qual campo de input deve ser mostrado
            - addVideo: gera iframe de video do youtube com url do state
            - addUrlImage: gera imagem atráves de url do state
            - addUploadImage: gera uma imagem por upload passando blob e chave do state, e callback para pai (backend)
            - createImage (auxiliar): recebe string com url e gera img no campo de edição
            - post: guarda o valor HTML do campo de edição e enviar para pai (backend)

        props:
            - updating: booleano, quando true, campo de edição recebe dados para update e seta saida para key existente
            - title: titulo para postagem em update
            - postImage: função de saída para upload de imagem
            - post: função de saída para HTML de campo de edição
            - defaultText: recebe texto default para campo de edição
    */

    state = {
        inputField: null,
        urls: "",
        imageWidth: 20,
        imageHeight: 20,
        imageFile: null,
        title: this.props.updatig ? this.props.title : "titulo-" + new Date().getTime(),
    }

    //Função para manipular a fomatação html do campo de edição
    format = (commmand) =>{
        document.execCommand(commmand);
    }

    //Função para atribuir títulos html para trechos de texto no campo de edição
    titles = (width) =>{
        //Salvando intervalo selecionado
        let range = window.getSelection().getRangeAt(0);

        //Buscando nó atual do intervalo
        let node = range.startContainer.parentElement;        

        //Se intervalo já possui o título, tornar parágrafo
        if(node.nodeName === width.toUpperCase()){   
            document.execCommand("heading", null, "p");
        }
        //Se intervalo não possui o título, aplicar
        else {
            document.execCommand("heading", null, width);
        }
        
    }

    //Função para atribuir hiperlink para texto
    linking = () =>{
        document.execCommand('CreateLink', false, this.state.urls);
    }

    //Função para controle de campos de inputs
    inputs = (e) =>{
        if(e.target.files){
            //Caso de input de imagem 
            this.setState({[e.target.name]: e.target.files[0]})
        }
        
        else {
            //Inputs comuns
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
                    <input name="urls" id="url-input" type="text" defaultValue={this.state.urls} onChange={this.inputs} />

                    <button onClick={() => this.linking()}>Salvar</button>
                    <button onClick={() => this.setState({inputField: null})}>Cancelar</button>
                </div>
            );

            this.setState({inputField: content});
        }
        
        else if (type === "video"){
            //Caso em que botão de video foi clicado
            //Gerando campo com inputs e salvando no state para renderização
            let content = (
                <div>
                    <label htmlFor="url-input">YouTube URL:</label>
                    <input name="urls" id="url-input" type="text" onChange={this.inputs} defaultValue={this.state.urls}/>

                    <button onClick={() => this.addVideo()}>Salvar</button>
                    <button onClick={() => this.setState({inputField: null})}>Cancelar</button>
                </div>
            );

            this.setState({inputField: content});
        }
        
        else if (type === "image"){
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
        }
        
        else if (type === "urlImage"){
            //Caso em que subopção de imagem por url foi escolhida
            //Gerando campo com inputs e salvando no state para renderização
            let content = (
                <div>
                    <label htmlFor="url-input">URL:</label>
                    <input contenteditable name="urls" id="url-input" type="text" onChange={this.inputs} defaultValue={this.state.urls}/>

                    <label htmlFor="width-input">Lagura:</label>
                    <input name="imageWidth" id="width-input" type="number" onChange={this.inputs} defaultValue={this.state.imageWidth}/>

                    <label htmlFor="height-input">Altura:</label>
                    <input name="imageHeight" id="height-input" type="number" onChange={this.inputs} defaultValue={this.state.imageHeight}/>

                    <button onClick={() => this.addUrlImage()}>Salvar</button>
                    <button onClick={() => this.setState({inputField: null})}>Cancelar</button>
                </div>
            );

            this.setState({inputField: content});
        }
        
        else if (type === "uploadImage"){
            //Caso em que subopção de imagem por upload foi escolhida
            //Gerando campo com inputs e salvando no state para renderização
            let content = (
                <div>
                    <label htmlFor="upload-input">Escolha um aquivo no computador:</label>
                    <input id="upload-input" type="file" accept="image/x-png,image/gif,image/jpeg" name="imageFile" onChange={this.inputs}/>

                    <label htmlFor="width-input">Lagura:</label>
                    <input name="imageWidth" id="width-input" type="number" onChange={this.inputs} defaultValue={this.state.imageWidth}/>

                    <label htmlFor="height-input">Altura:</label>
                    <input name="imageHeight" id="height-input" type="number" onChange={this.inputs} defaultValue={this.state.imageHeight}/>

                    <button onClick={() => this.addUploadImage()}>Salvar</button>
                    <button onClick={() => this.setState({inputField: null})}>Cancelar</button>
                </div>
            );

            this.setState({inputField: content});
        }

        else if(type === "html"){
            //Caso em que post é chamado
            //Gerando campo com input para título da publicação
            let content = (
                <div>
                    <label htmlFor="title-input">Título:</label>
                    <input name="title" id="title-input" type="text" onChange={this.inputs} defaultValue={this.state.title}/>

                    <button onClick={() => this.post()}>Salvar</button>
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
            iframe.src= "https://www.youtube.com/embed/"+this.state.urls;

            let range = window.getSelection().getRangeAt(0);
            range.insertNode(iframe);
        }
    }

    //Função para adicionar imagem por url
    addUrlImage = () => {
        this.createImage(this.state.urls);
    }

    //Função para adicionar imagem por upload
    addUploadImage = () => {
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

    //Função para publicação do texto no campo de edição
    post = () => {
        //Salvando HTML de saida
        let exitHtml = document.getElementById("editor").innerHTML;

        //Enviando para servidor por props
        this.props.post(exitHtml, this.state.title);
    }

    componentDidMount(){
        let editor = document.getElementById("editor");
        editor.innerHTML = this.props.defaultText;
    }

    render(){
        return(
            <div className="editor-content">

                <Toolbar
                    format={this.format}
                    titles={this.titles}
                    changeInputField={this.changeInputField}
                />

                {
                    this.state.inputField
                }

                <div className="editor-paper" contentEditable="true" designmode="on" id="editor" spellCheck="true"> 
    
                </div>

                <div className="controls-content">
                    <button className="editor-button" onClick={() => this.changeInputField("html")}>SALVAR</button>

                    <button className="editor-button" onClick={() => this.props.goBack(1)}>CANCELAR</button>
                </div>

                
            </div>
        )
    }

    

}

export default Editor;