import React from 'react';
import Editor from './components/Editor/Editor';
import firebase from 'firebase/app';
import "firebase/firebase-storage";

class App extends React.Component {
  //state indicará tela a ser renderizada
  state = {
    screen: 1
  }

  //Função para mudanção da tela
  changeScreen = (screen) =>{
    this.setState({screen: screen});
  }

  //Função para post de imagem (com firebase para testes)
  postImge = (img, key, callBack) => {
    console.log("init upload file...")

    //Postando arquivo
    firebase.storage().ref("imgs/"+key).put(img).on('state_changed',
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
          firebase.storage().ref("imgs/"+key).getDownloadURL().then((url) => {
            //Caso de sucesso, passando url para callBack que cria elemento img no editor
            callBack(url);

          }).catch((error) => {
            //Caso de erro para obter referência
            console.log(error);
          });
        }
      );
  }

  render() {

    if(this.state.screen === 1){
      //Retornando tela default com caminho para outras telas
        return (
        <div>
          <button onClick={() => this.changeScreen(2)}>
            Postagens
          </button>
          <button onClick={() => this.changeScreen(3)}>
            Nova publicação
          </button>
        </div>
      );
    } else if (this.state.screen === 2){
      //Retornarndo tela com lista de postagens do servidor
      return(
        <div>
          postagens...
          <button onClick={() => this.changeScreen(1)}>
            voltar
          </button>
        </div>
      )
    } else {
      //Retornando área de edição de texto
      return(
        <div>
          <h1>editor...</h1>

          <Editor postImg={this.postImge} getImg={this.getImage}/>

          <button onClick={() => this.changeScreen(1)}>
            voltar
          </button>
        </div>
      )
    }
    
  }
}

export default App;