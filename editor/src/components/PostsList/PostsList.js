import React, { Component } from 'react';
import firebase from 'firebase/app';
import "firebase/firebase-database";

class PostsList extends Component{

    state = {
        list: []
    }

    //Função para buscar lista de dasdos no servidor
    getData = () => {

        let newList = [];

        firebase.database().ref("posts/").on('value', (snapshot) => {

            snapshot.forEach((post) =>{
                newList.push(post.val());
            })

            this.setState({list: newList});
        });
    }

    componentDidMount(){
        this.getData();
    }

    render(){
        return(
            <ul>
                {
                    this.state.list.length > 0 ?

                    this.state.list.map((post) => {
                        return(
                        <li key={post.title}>
                            {post.title} /
                            <button onClick={() => this.props.renderPost(post)}>ver</button>
                            <button onClick={() => this.props.update(post)}>editar</button>
                            <button onClick={() => this.props.removeData(post.title)}>excluir</button> 
                        </li>)
                    })

                    : "nenhuma postagem no momento..."
                }
            </ul>
        )
    }
}

export default PostsList;