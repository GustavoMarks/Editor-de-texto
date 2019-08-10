import React, { Component } from 'react';
import './Editor.css';
import {BoldIcon, CenterAlignIcon, ImageIcon, ItalicIcon, JustifyAlignIcon, LeftAlignIcon, LinkIcon, ListIcon, ListOIcon, RedoIcon, RightAlignIcon, Title1Icon, TitleIcon, UnderlineIcon, UndoIcon, UnlinkIcon, YoutubeLogo} from './Icons';

class Toolbar extends Component {

    render(){
        return(
            <div className="toolbar-content">
                <button onClick={() => this.props.titles("h2")}>
                    <TitleIcon/>
                </button>
                <button onClick={() => this.props.titles("h3")}>
                    <Title1Icon/>
                </button>
                <button onClick={() => this.props.format("bold")}>
                    <BoldIcon/>
                </button>
                <button onClick={() => this.props.format("italic")}>
                    <ItalicIcon/>
                </button>
                <button onClick={() => this.props.format("underline")}>
                    <UnderlineIcon/>
                </button>
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
                    <ListOIcon/>
                </button>
                <button onClick={() => this.props.format("insertUnorderedList")}>
                    <ListIcon/>
                </button>
                <button onClick={() => this.props.changeInputField("image")}>
                    <ImageIcon/>
                </button>
                <button onClick={() => this.props.changeInputField("video")}>
                    <YoutubeLogo/>
                </button>
                <button onClick={() => this.props.changeInputField("link")}>
                    <LinkIcon/>
                </button>
                <button onClick={() => this.props.format("unlink")}>
                    <UnlinkIcon/>
                </button>
                <button onClick={() => this.props.format("undo")}>
                    <UndoIcon/>
                </button>
                <button onClick={() => this.props.format("redo")}>
                    <RedoIcon/>
                </button>
            </div>
        )
    }


}

export default Toolbar;