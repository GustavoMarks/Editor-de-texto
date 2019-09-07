import React, { Component } from 'react';
import firebase from 'firebase/app';
import "firebase/firebase-database";

class PostsList extends Component{

    state = {
        list: []
    }

    //Função para buscar lista de dasdos no servidor
    getData = () => {

        firebase.database().ref("posts/").on('value', (snapshot) => {
            let newList = [];

            snapshot.forEach((post) =>{
                newList.unshift(post.val());
            })

            this.setState({list: newList});
        });
    }

    componentDidMount(){
        this.getData();
    }

    render(){
        return(
            <div>
                {
                    this.state.list.length > 0 ?

                    this.state.list.map((post) => {
                        return(
                        <div className="postsLists" key={post.id}>
                            <h2>{post.titulo}</h2>
                            <img src={post.capa} alt={post.titulo}/>
                            <span>{post.data}</span>
                            <p>{post.desc}</p>
                            <div>
                                <button onClick={() => this.props.renderPost(post)}>ver</button>
                                <button onClick={() => this.props.update(post)}>editar</button>
                                <button onClick={() => this.props.removeData(post.id)}>excluir</button>
                            </div>
                             
                        </div>)
                    })

                    : "nenhuma postagem no momento..."
                }
            </div>
        )
    }
}

export default PostsList;