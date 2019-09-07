import React, { Component } from 'react';
import './Editor.css';
import {BoldIcon, CenterAlignIcon, ImageIcon, ItalicIcon, JustifyAlignIcon, LeftAlignIcon, LinkIcon, ListIcon, ListOIcon, RedoIcon, RightAlignIcon, Title1Icon, TitleIcon, UnderlineIcon, UndoIcon, UnlinkIcon, YoutubeLogo} from './Icons';

class Toolbar extends Component {

    //State muda a cor de cada botão para texto da edição já possua aquela propriedade
    state = {
        h2: false,
        h3: false,
        bold: false,
        italic: false,
        underline: false,
        ol: false,
        ul: false,
        link: false
    }

    buttonsUpdate = () =>{
        let range = window.getSelection().getRangeAt(0);
        let h2 = false;
        let h3 = false;
        let bold = false;
        let italic = false;
        let underline = false;
        let ul = false;
        let ol = false;
        let link = false;
        let parentsList = [];

        //Iterando nodes
        function gettingNodeParents(node){
            parentsList.push(node);
            if(node.parentElement)
                gettingNodeParents(node.parentElement)
        }

        gettingNodeParents(range.startContainer.parentElement);
        
        parentsList.forEach( (element) => {
            if(element.tagName === "H2")
                h2 = true;
            if(element.tagName === "H3")
                h3 = true;
            if(element.tagName === "B")
                bold = true;
            if(element.tagName === "I")
                italic = true;
            if(element.tagName === "U")
                underline = true;
            if(element.tagName === "UL")
                ul = true;
            if(element.tagName === "OL")
                ol = true;
            if(element.tagName === "A")
                link = true;
        })

        this.setState({
            h2: h2,
            h3: h3,
            bold: bold,
            italic: italic,
            underline: underline,
            ul: ul,
            ol: ol,
            link: link
        })
    }

    render(){
        return(
            <div className="toolbar-content" onClick={() => this.buttonsUpdate()}>
                <button onClick={() => this.props.format("undo")}>
                    <UndoIcon/>
                </button>
                <button onClick={() => this.props.format("redo")}>
                    <RedoIcon/>
                </button>
                <div className="toolbar-divisor"/>
                <button onClick={() => this.props.titles("h2")}>
                    <TitleIcon fill={this.state.h2 ? '#4682B4' : null}/>
                </button>
                <button onClick={() => this.props.titles("h3")}>
                    <Title1Icon fill={this.state.h3 ? '#4682B4' : null}/>
                </button>
                <div className="toolbar-divisor"/>
                <button onClick={() => this.props.format("bold")}>
                    <BoldIcon fill={this.state.bold ? '#4682B4' : null}/>
                </button>
                <button onClick={() => this.props.format("italic")}>
                    <ItalicIcon fill={this.state.italic ? '#4682B4' : null}/>
                </button>
                <button onClick={() => this.props.format("underline")}>
                    <UnderlineIcon fill={this.state.underline ? '#4682B4' : null}/>
                </button>
                <div className="toolbar-divisor"/>
                <button onClick={() => this.props.format("justifyFull")}>
                    <JustifyAlignIcon/>
                </button>
                <button onClick={() => this.props.format("justifyLeft")}>
                    <LeftAlignIcon/>
                </button>
                <button onClick={() => this.props.format("justifyCenter")}>
                    <CenterAlignIcon/>
                </button>
                <button onClick={() => this.props.format("justifyRight")}>
                    <RightAlignIcon/>
                </button>
                <button onClick={() => this.props.format("insertOrderedList")}>
                    <ListOIcon fill={this.state.ol ? '#4682B4' : null}/>
                </button>
                <button onClick={() => this.props.format("insertUnorderedList")}>
                    <ListIcon fill={this.state.ul ? '#4682B4' : null}/>
                </button>
                <div className="toolbar-divisor"/>
                <button id="openImageChoices">
                    <ImageIcon/>
                </button>
                <button id="openYt">
                    <YoutubeLogo/>
                </button>
                <button id="openLink">
                    <LinkIcon/>
                </button>
                <button onClick={() => this.props.format("unlink")}>
                    <UnlinkIcon fill={this.state.link ? '#4682B4' : null}/>
                </button>
                
            </div>
        )
    }

    componentDidMount(){

        //Referência para caixa de texto editável
        let editor = document.getElementById("editor");

        //Atualizando botões quando caixa de texto é clicada ou texto é percorrido
        editor.onclick = this.buttonsUpdate;
        editor.onkeydown = this.buttonsUpdate;
        editor.onkeyup = this.buttonsUpdate;
        editor.onchange = this.buttonsUpdate;
    }
}

export default Toolbar;