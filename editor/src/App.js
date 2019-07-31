import React from 'react';
import Editor from './components/Editor/Editor';

class App extends React.Component {
  //state indicará tela a ser renderizada
  state = {
    screen: 1
  }

  changeScreen = (screen) =>{
    this.setState({screen: screen});
  }

  render() {

    if(this.state.screen === 1){
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
      return(
        <div>
          postagens...
          <button onClick={() => this.changeScreen(1)}>
            voltar
          </button>
        </div>
      )
    } else {
      return(
        <div>
          <h1>editor...</h1>

          <Editor/>

          <button onClick={() => this.changeScreen(1)}>
            voltar
          </button>
        </div>
      )
    }
    
  }
}

export default App;