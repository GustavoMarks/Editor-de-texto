import React from 'react';
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

  //Função de saída do texto html (usando firebase para testes)
  postHtml = (html, title) => {
    firebase.database().ref("posts/"+title).set({
      title: title,
      text: html,
    },

    (error) =>{
      if(error){
        console.log(error)
        console.log("Post fail...");
      } else {
        console.log("Successfully saved!")
      }
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
    firebase.database().ref("posts/"+key).remove().then(() => {
      console.log("Post removed!");
    })
  }

  //Funções para estilização dinâmica com hover
  hoverOnEnter = (e) =>{
     e.target.style.backgroundColor = '#708090';
  }

  hoverOnLeave = (e) => {
    e.target.style.backgroundColor = '#4682B4';
  }

  render() {

    if(this.state.screen === 1){
      //Retornando tela default com caminho para outras telas
        return (
        <div style={style.content}>
          <h1>EDITOR WYSIWYG</h1>
          <button 
            style={style.button}
            onMouseEnter={this.hoverOnEnter}
            onMouseLeave={this.hoverOnLeave}
            onClick={() => this.changeScreen(2)}>
            POSTAGENS
          </button>
          <button 
            style={style.button}
            onMouseEnter={this.hoverOnEnter}
            onMouseLeave={this.hoverOnLeave}
            onClick={() => this.changeScreen(3)}>
            NOVA PUBLICAÇÃO
          </button>
        </div>
      );
    } else if (this.state.screen === 2){
      //Retornarndo tela com lista de postagens do servidor
      return(
        <div>
          <PostsList renderPost={this.renderPost} removeData={this.removeHtml} update={this.updateHtml}/>
          <button onClick={() => this.changeScreen(1)}>
            voltar
          </button>
        </div>
      )
    } else if (this.state.screen === 3){
      //Retornando área de edição de texto
      return(
        <div>
          <h1>editor...</h1>

          <Editor postImg={this.postImge} post={this.postHtml} defaultText="Digite aqui..."/>

          <button onClick={() => this.changeScreen(1)}>
            voltar
          </button>
        </div>
      )
    } else if (this.state.screen === 4){
      //Retorando área de visualização de postagem
      return(
        <div>
          <Post data={this.state.post}/>
          <button onClick={() => this.changeScreen(1)}>
            voltar
          </button>

        </div>
      )
    } else if(this.state.screen === 5){
      //Campo de edição para update de uma postagem
      return(
        <div>
          
          <h1>Atualizando {this.state.post.title}</h1>

          <Editor
            updatig
            title={this.state.post.title}
            postImg={this.postImge}
            post={this.postHtml}
            defaultText={this.state.post.text}
          />
          
          <button onClick={() => this.changeScreen(1)}>
            voltar
          </button>

        </div>
      )
    }
    
  }
}


const style = {
  content : {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F8F8FF',
    minHeight: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#4682B4',
  },

  button : {
    minWidth: '50%',
    height: '40px',
    border: 'none',
    borderRadius: 10,
    margin: '5px 0 5px 0',
    backgroundColor: '#4682B4',
    color:'#F8F8FF',
    fontFamily: 'Arial Black',
  },

  hoverButton : {
    backgroundColor: '#708090',
  }

}

export default App;