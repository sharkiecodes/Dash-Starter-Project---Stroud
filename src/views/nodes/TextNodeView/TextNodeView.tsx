import { observer } from "mobx-react";
import * as React from 'react';
import { StaticTextNodeStore } from "../../../stores";
import { TopBar } from "../TopBar";
import "./../NodeView.scss";
import "./TextNodeView.scss";
import { ResizeHandle } from "../ResizeHandle";

interface TextNodeProps {
    store: StaticTextNodeStore;
}

@observer
export class TextNodeView extends React.Component<TextNodeProps> {


    render() {
        let store = this.props.store;

        return (
            <div className="node textNode" style={{
                transform: store.transform,       // position via translate
                width: store.width + "px",        // set width
                height: store.height + "px",      // set height
                position: "absolute"              //absolute positioning so that other nodes aren't affected by transform/resizing!
            }} onWheel={(e: React.WheelEvent) => {
                e.stopPropagation();
                e.preventDefault();
            }}>
                <TopBar store={store}/> 
                <div className="scroll-box">
                    <div className="content">
                        <h3 className="title">{store.title}</h3>
                        <p className="paragraph">{store.text}</p>
                    </div>
                </div>
                <ResizeHandle store={store}/> 
            </div> 
        );
    }
}