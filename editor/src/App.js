import React from 'react';
import './App.css';
import Editor from './components/Editor/Editor';
import PostsList from './components/PostsList/PostsList';
import Post from './components/PostsList/Post';
import firebase from 'firebase/app';
import "firebase/firebase-storage";
import "firebase/firebase-database";

class App extends React.Component {
  //state indicará tela a ser renderizada, post guardará um objeto para renderizaração
  state = {
    screen: 1,
    post: {},
  }

  //Função para mudanção da tela
  changeScreen = (screen) =>{
    this.setState({screen: screen});
  }

  //Função para leitura de post
  renderPost = (data) => {
    this.setState({
      screen: 4,
      post: data
    })
  }

  //Função para post de imagem (com firebase para testes)
  postImge = (img, postId, key, callBack1) => {
    console.log("init upload file...")

    //Postando arquivo
    firebase.storage().ref("imgs/"+postId+"/"+key).put(img).on('state_changed',
        (snapshot) => {

          //Porcentagem de carregamento do arquivo para o servidor
          let percent = (snapshot.bytesTransferred/snapshot.totalBytes) * 100;
          console.log("Uploaded in " + percent.toFixed(0) + "%");
        },

        (err) => {

          //Caso de erro para fazer postagem
          console.log(err)
          return null
        },

        () => {

          //Buscando referência da imagem no servidor firebase
          console.log("init call...");
          firebase.storage().ref("imgs/"+postId+"/"+key).getDownloadURL().then((url) => {
            //Caso de sucesso, passando url para callBack que cria elemento img no editor
            callBack1(url);

          }).catch((error) => {
            //Caso de erro para obter referência
            console.log(error);
          });
        }
      );
  }

  //Função de saída do texto html (usando firebase para testes)
  postHtml = (post, callBack) => {
    firebase.database().ref("posts/"+post.id).set(post,
    (error) =>{
      if(error){
        console.log(error)
        console.log("Post fail...");
        callBack("Erro inesperado!", true);
      } else {
        console.log("Successfully saved!");
        callBack("Postagem salva!", false);
      }
    }).then(() =>{
      this.changeScreen(1);
    })
  }

  //Função para update de post (usando firebase para testes)
  updateHtml = (newData) => {
    this.setState({
      post: newData,
      screen: 5
    })
  }

  //Função de deleção de postagem
  removeHtml = (key) => {
    //Removendo postagem
    firebase.database().ref("posts/"+key).remove().then(() => {
      console.log("Post removed!");
    })

    //Removendo imagens associadas
    firebase.storage().ref("imgs/"+key+"/").delete().then(() => {
      console.log("concluido")
    }).catch((e) => {
      console.log(e);
    })
  }

  //Função para deleção de imagens no servidor
  removeImage = (postId, imgKeys, callBack) =>{
    callBack("Removendo imagens do servidor...", false);

    let count = 0;
    //Percorrendo lista com chaves de imagens a serem deletadas
    imgKeys.forEach(key => {
      count++;
      firebase.storage().ref("imgs/"+postId+"/"+key).delete().then(() => {
        callBack("imagens removidas com sucesso: " +count, false);
        console.log("concluido")
        if(count === imgKeys.length)
          this.changeScreen(1)
      }).catch((e) =>{
        console.log(e)
        callBack("Erro inesperdo!", true);
      });
    });
    
    

  }

  render() {

    if(this.state.screen === 1){
      //Retornando tela default com caminho para outras telas
        return (
          <div className="content">
            <h1>EDITOR WYSIWYG</h1>
            <button className="content-button" onClick={() => this.changeScreen(2)}>
              POSTAGENS
            </button>
            <button className="content-button" onClick={() => this.changeScreen(3)}>
              NOVA PUBLICAÇÃO
            </button>
          </div>
      );
    } else if (this.state.screen === 2){
      //Retornarndo tela com lista de postagens do servidor
      return(
        <div className="content">
          <h1>LISTA DE POSTAGENS</h1>
          <PostsList 
            renderPost={this.renderPost}
            removeData={this.removeHtml} 
            update={this.updateHtml}/>
          <button className="content-button" onClick={() => this.changeScreen(1)}>
            VOLTAR
          </button>
        </div>
      )
    } else if (this.state.screen === 3){
      //Retornando área de edição de texto
      return(
        <div className="editor-view">
          <Editor 
            postImg={this.postImge} 
            post={this.postHtml} 
            goBack={this.changeScreen} 
            defaultText=" "
            deleteImg={this.removeImage}
          />

        </div>
      )
    } else if (this.state.screen === 4){
      //Retorando área de visualização de postagem
      return(
        <div style={{margin: "20px"}}>
          <Post data={this.state.post}/>
          <button className="content-button" onClick={() => this.changeScreen(1)}>
            VOLTAR
          </button>

        </div>
      )
    } else if(this.state.screen === 5){
      //Campo de edição para update de uma postagem
      return(
        <div>
          
          <h1>Atualizando {this.state.post.titulo}</h1>

          <Editor
            updatig={this.state.post}
            postImg={this.postImge}
            deleteImg={this.removeImage}
            post={this.postHtml}
            defaultText={this.state.post.texto}
            goBack={this.changeScreen}
          />

        </div>
      )
    }
    
  }
}

export default App;