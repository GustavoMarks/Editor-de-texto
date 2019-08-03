import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as firebase from 'firebase/app';

  //Configurações do Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyCfdqlHhSRQCyVH9V7FZWXgFDbqVbYcVpQ",
    authDomain: "editor-wysiwyg.firebaseapp.com",
    databaseURL: "https://editor-wysiwyg.firebaseio.com",
    projectId: "editor-wysiwyg",
    storageBucket: "editor-wysiwyg.appspot.com",
    messagingSenderId: "666152057237",
    appId: "1:666152057237:web:44dda3b851498c75"
  };

  // Inicializando firebase
  firebase.initializeApp(firebaseConfig);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
