import React, { Component } from 'react';
import Toolbar from './Toolbar';
import Modal from './Modal';
import './Editor.css';

const monthList = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const pegaDataString = () =>{
    let d = new Date();
    let dia = d.getDate();
    let mes = monthList[d.getMonth()];
    let ano = d.getFullYear();
    return dia + " de " + mes + ", " + ano;
}

class Editor extends Component {

    /*
        State:
            - inputField: guarda campo dinâmico para inputs
            - urls: guarda inputs de url
            - imageWidth: guarda valores (%) para dimensão de largura de imagem a ser inserida (default 20)
            - imageHeight: guarda valores (%) para dimensão de altura de imagem a ser inserida (default 20)
            - imageFile: guarda arquivo de imagem para upload
            - postId: guarda id aleatório da nova postagem (também é usado na referência de imagens por upload)
            - title: guarda valor de titulo para post da publicação (default titulo-{numero randomico})
            - date: guarda string para data da postagem da publicação
            - cover: guarda referência para imagem da capa da postagem.
            - description: guarda string com descrição da postagem para pré-exibição
            - range: guarda seleção de texto (para ser recuperada em caso de abertura de modal)
            - popup: guarda bool indicando visibilidade do pop up
            - popupMessage: guarda mensagem a ser exibida em popup
            - popupWarning: guarda booleano indicando se pop é um aviso negativo
            - tempImgRefs: guarda lista temporário com referências de imagens adicionadas por upload

        Métodos:
            - format: recebe uma string de comando para aplicar formatação via DOM (com função nativa)
            - titles: recebe uma string com tamanho do título a ser aplicado e trata casos de formatação
            - linking: aplica formtação de link com url do state
            - inputs: recebe evento e manibula dados de inputs para o state
            - addVideo: gera iframe de video do youtube com url do state
            - addUrlImage: gera imagem atráves de url do state
            - addUploadImage: gera uma imagem por upload passando blob e chave do state, e callback para pai (backend)
            - createImage (auxiliar): recebe string com url e gera img no campo de edição
            - post: guarda o valor HTML do campo de edição e enviar para pai (backend)
            - saveRange: salva selação de texto no state
            - showPopup: ativa popup e atualiza mensagem
            - addNewUploadRef: adiciona ref a uma lista temporária de referências do servidor, para excluir imagens em caso de cancelamento da postagem


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
        postId: this.props.updatig ? this.props.updatig.id : new Date().getTime(),
        title: this.props.updatig ? this.props.updatig.titulo : "titulo-" + new Date().getTime(),
        date: this.props.updatig ? this.props.updatig.data : pegaDataString(),
        cover: null,
        description: this.props.updatig ? this.props.updatig.desc : " ",
        range: null,
        popup: false,
        popupMessage: null,
        popupWarning: false,
        tempImageRefs: [],
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
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(this.state.range);
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

    //Função para adição de vídeo por iframe com link externo
    addVideo = () => {
        let entry = this.state.urls;

        if(entry.indexOf("https://www.youtube.com") !== -1){
            if(entry.indexOf("index=") !== -1 || entry.indexOf("radio=") !== -1){
                let iframe = document.createElement("iframe");
                iframe.type = "text/html";
                iframe.height = "360";
                iframe.width = "80%";
                iframe.src= "https://www.youtube.com/embed/"+entry;

                let range = this.state.range;
                this.showPopup("Playlist do Youtube inserida!", false)
                range.insertNode(iframe);

            } else if (entry.indexOf("watch?v=") !== -1){
                let iframe = document.createElement("iframe");
                iframe.type = "text/html";
                iframe.height = "360";
                iframe.width = "80%";

                let id = entry.split("watch?v=")[1];
                iframe.src= "https://www.youtube.com/embed/"+id;

                let range = this.state.range;
                this.showPopup("Vídeo do Youtube inserido!", false)
                range.insertNode(iframe);
            } else {
                this.showPopup("Link corrompido...", true);
            }
        } else {
            this.showPopup("Link inválido...", true);
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

            //Abrindo popup de aviso
            this.showPopup("Enviando imagem para servidor...", false);

            //Gerando nova chave para imagem no servidor
            let newKey = new Date().getTime();

            //Enviando imagem, key e callbacks para gerar imagem
            this.props.postImg(this.state.imageFile, this.state.postId, newKey, this.createImage);

            //Guardando referência da imagem na lista de referências temporária
            this.addNewUploadRef(newKey);

        } else {
            this.showPopup("Selecione um arquivo!", true)
        }
    }

    //Função para adicionar uma nova referência temporária a lista do state
    addNewUploadRef = (key) =>{
        let list = this.state.tempImageRefs;
        list.push(key);
        this.setState({
            tempImageRefs: list
        })
    } 

    //Função para criar um elemento img no campo de edição
    createImage = (url) => {
        this.showPopup("Nova imagem adicionada ao texto!", false);
        if(url){
            let img = document.createElement("img");
            img.src = url;
            img.style.width = this.state.imageWidth + "%";
            img.style.height = this.state.imageHeight + "%";

            let range = this.state.range;
            range.insertNode(img);
        }
    }

    //Função para publicação do texto no campo de edição
    post = () => {

        //Verificando se todos os campos de dados do post foram preenchidos
        if(this.state.title && this.state.cover && this.state.date && this.state.description){
            //Salvando HTML de saida
            let exitHtml = document.getElementById("editor").innerHTML;

            this.showPopup("Enviando capa para servidor...", false);

            //criando estrutura de post e callback a que recerá url da imagem da capa
            let callback = (coverUrl) => {
                let post = {
                    id: this.state.postId,
                    titulo: this.state.title,
                    data: this.state.date,
                    capa: coverUrl,
                    desc: this.state.description,
                    texto: exitHtml,
                }

                this.showPopup("Enviando postagem para o servidor...", false);

                //Enviando para servidor por props
                this.props.post(post, this.showPopup);

            }
            
            //guardando imagem da capa no banco de dados
            this.props.postImg(this.state.cover, this.state.postId, "capa-"+this.state.postId, callback);


            
        } else{
            this.showPopup("Preencha todos os campos para completar a postagem!", true);
        }
        
    }

    //Função para salvar seleção do campo de edição antes de abertura de modal ou ação semelhante
    saveRange = () => {
        if(window.getSelection().getRangeAt(0))
            this.setState({
                range: window.getSelection().getRangeAt(0),
            })
    }

    //Função para ativar popup e atualizar mensagem
    showPopup = (msg, warning) =>{
        this.setState({
            popup: true,
            popupMessage: msg,
            popupWarning: warning
        })
    }

    //Função de cancelamento do post, verifica se há imagens na lista de referências temporária e volta a tela anterior
    cancelPost = () =>{
        if(this.state.tempImageRefs.length > 0){
            this.props.deleteImg(this.state.postId, this.state.tempImageRefs, this.showPopup);
        } else {
            this.props.goBack(1)
        }
    }

    //Passando defaultText para campo de edição após montagem do componente
    componentDidMount(){
        let editor = document.getElementById("editor");
        editor.focus();
        editor.innerHTML = this.props.defaultText;
    }

    render(){
        return(
            <div className="editor-content">
                <h2 className="editor-content-title">NOVA PUBLICAÇÃO</h2>

                <Toolbar
                    format={this.format}
                    titles={this.titles}
                />

                {
                    //Modal para input de link para hiperlink
                }
                <Modal listenersId={["cancel-url", "openLink", "submit-hiperlink"]}>
                    <div className="editor-modal-children-conteint">
                        <h3 className="editor-content-title">ADICIONAR HIPERLINK</h3>
                        <div className="editor-modal-children-subconteint">
                            <label htmlFor="url-input">URL:</label>
                            <input className="editor-modal-children-conteint-input" name="urls" id="url-input" type="text" defaultValue={this.state.urls} onChange={this.inputs} />
                            <button id="submit-hiperlink" className="editor-button" onClick={() => this.linking()}>Salvar</button>
                            <button id="cancel-url" className="editor-button">Cancelar</button>
                        </div>
                    </div>
                </Modal>

                {
                    //Modal para input de link para video do youtube
                }
                <Modal listenersId={["cancel-urlyt", "openYt", "submit-ytvideo"]}>
                    <div className="editor-modal-children-conteint">
                    <h3 className="editor-content-title">ADICIONAR VÍDEO DO YOUTUBE</h3>
                        <div className="editor-modal-children-subconteint">
                            <label htmlFor="url-input">YouTube URL:</label>
                            <input className="editor-modal-children-conteint-input" name="urls" id="url-input" type="text" onChange={this.inputs} defaultValue={this.state.urls}/>

                            <button id="submit-ytvideo" className="editor-button" onClick={() => this.addVideo()}>Salvar</button>
                            <button className="editor-button" id="cancel-urlyt">Cancelar</button>
                        </div>
                    </div>
                </Modal>

                {
                    //Modal para escolha de tipo de imagem
                }
                <Modal listenersId={["cancel-choiceImage", "openImageChoices", "open-imageUrl", "open-imageUpload"]}>
                    <div className="editor-modal-children-conteint">
                    <h3 className="editor-content-title">SELEECIONE O TIPO DE IMAGEM</h3>
                        <div className="editor-modal-children-subconteint">
                           <button id="open-imageUrl" className="editor-button">Imagem url</button>
                            <button id="open-imageUpload" className="editor-button">Imagem upload</button>
                            <button id="cancel-choiceImage" className="editor-button">Cancelar</button> 
                        </div>
                        
                    </div>
                </Modal>

                {
                    //Modal para input de imagem por url
                }

                <Modal listenersId={["open-imageUrl", "cancel-imageUrl", "submit-imgurl"]}>
                    <div className="editor-modal-children-conteint">
                    <h3 className="editor-content-title">ADICIONAR IMAGEM POR URL</h3>
                        <div className="editor-modal-children-subconteint">
                            <label htmlFor="url-input">URL:</label>
                            <input className="editor-modal-children-conteint-input" name="urls" id="url-input" type="text" onChange={this.inputs} defaultValue={this.state.urls}/>
                        </div>

                        <div className="editor-modal-children-subconteint">
                            <div>
                               <label htmlFor="width-input">Lagura: </label>
                                <input className="editor-modal-numberinput" name="imageWidth" id="width-input" type="number" onChange={this.inputs} defaultValue={this.state.imageWidth}/> 
                            </div>
                            
                            <div>
                                <label htmlFor="height-input">Altura: </label>
                                <input className="editor-modal-numberinput" name="imageHeight" id="height-input" type="number" onChange={this.inputs} defaultValue={this.state.imageHeight}/>
                            </div>  
                            
                        </div>
                        <div className="editor-modal-children-subconteint">
                            <button id="submit-imgurl" onClick={() => this.addUrlImage()} className="editor-button">Salvar</button>
                            <button id="cancel-imageUrl" className="editor-button">Cancelar</button>
                        </div>
                    </div>
                    
                </Modal>

                {
                    //Modal para input de imagem por upload
                }
                <Modal listenersId={["open-imageUpload", "cancel-ImageUpload", "submit-imgupload"]}>
                    <div className="editor-modal-children-conteint">
                    <h3 className="editor-content-title">ADICIONAR IMAGEM POR UPLOAD</h3>
                        <div className="editor-modal-children-subconteint">
                            <label htmlFor="upload-input">Escolha um aquivo no computador:</label>
                            <input id="upload-input" type="file" accept="image/x-png,image/gif,image/jpeg" name="imageFile" onChange={this.inputs}/>
                        </div>
                        
                        <div className="editor-modal-children-subconteint">
                            <label htmlFor="width-input">Lagura:</label>
                            <input className="editor-modal-numberinput" name="imageWidth" id="width-input" type="number" onChange={this.inputs} defaultValue={this.state.imageWidth}/>
                            
                            <label htmlFor="height-input">Altura:</label>
                            <input className="editor-modal-numberinput" name="imageHeight" id="height-input" type="number" onChange={this.inputs} defaultValue={this.state.imageHeight}/>
                        </div>

                        <div className="editor-modal-children-subconteint">
                            <button id="submit-imgupload" className="editor-button" onClick={() => this.addUploadImage()}>Salvar</button>
                            <button id="cancel-ImageUpload" className="editor-button">Cancelar</button> 
                        </div>
                        <small className="editor-modal-children-subconteint" style={{textAlign: "center"}}>
                            <strong>Aviso:</strong> Esta opção fará upload da imagem no seu servidor. A referência da imagem será deletada caso esta postagem seja cancelada ou posteriormente excluída. Remover a imagem do texto não desviculará a imagem desta postagem.
                        </small>
                    </div>
                </Modal>

                {
                    //Modal para salve do texto editado
                }

                <Modal listenersId={["cancel-post", "salve", "save-submit"]}>
                    <div className="editor-modal-children-conteint">
                    <h3 className="editor-content-title">SALVAR POSTAGEM</h3>
                        <div className="editor-modal-children-subconteint">
                            <label htmlFor="title-input">Título:</label>
                            <input className="editor-modal-children-conteint-input" name="title" id="title-input" type="text" onChange={this.inputs} defaultValue={this.state.title}/>
                        </div>

                        <div className="editor-modal-children-subconteint">
                            <label htmlFor="title-input">Data:</label>
                            <input className="editor-modal-children-conteint-input" name="date" id="title-input" type="text" onChange={this.inputs} defaultValue={this.state.date}/>
                        </div>

                        <div className="editor-modal-children-subconteint">
                            <label htmlFor="title-input">Descrição:</label>
                            <textarea className="editor-modal-children-conteint-input" name="description" id="title-input" type="text" onChange={this.inputs} defaultValue={this.state.description} placeholder="Escreva aqui a descrição da sua postagem..."/>
                        </div>

                        <div className="editor-modal-children-subconteint">
                            <label htmlFor="upload-input">Imagem para a capa:</label>
                            <input id="upload-input" type="file" accept="image/x-png,image/gif,image/jpeg" name="cover" onChange={this.inputs}/>
                        </div>


                        <div className="editor-modal-children-subconteint">
                            <button id="save-submit" onClick={() => this.post()} className="editor-button">Salvar</button>
                            <button id="cancel-post" className="editor-button">Cancelar</button>
                        </div>
                        
                        
                    </div>
                </Modal>

                <div className="editor-paper" contentEditable="true" designmode="on" id="editor" spellCheck="true" onBlur={() => this.saveRange()}> 
    
                </div>

                <div className="controls-content">
                    <button id="salve" className="editor-button" >SALVAR</button>

                    <button className="editor-button" onClick={() => this.cancelPost()}>CANCELAR</button>
                </div>

                {
                    //Div para popup
                }

                <div className={this.state.popupWarning ? "popup-warning" : "popup"} style={this.state.popup ? {display: "block"} : {display: "none"}}>

                    {this.state.popupMessage}

                    <span>
                        <button onClick={() => this.setState({popup: false})}>
                            x
                        </button>
                    </span>
                </div>

            </div>
        )
    }
}

export default Editor;

