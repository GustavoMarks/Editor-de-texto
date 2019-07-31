import React from 'react';

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
          editor...
          <button onClick={() => this.changeScreen(1)}>
            voltar
          </button>
        </div>
      )
    }
    
  }
}

export default App;