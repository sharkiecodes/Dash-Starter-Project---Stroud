import { observer } from "mobx-react";
import * as React from 'react';
import { VideoNodeStore } from "../../../stores";
import "./../NodeView.scss";
import { TopBar } from "./../TopBar";
import "./VideoNodeView.scss";
import { ResizeHandle } from "../ResizeHandle";

interface VideoNodeProps {
    store: VideoNodeStore;
}

@observer
export class VideoNodeView extends React.Component<VideoNodeProps> {


    render() {
        let store = this.props.store;


        return (
            <div className="node videoNode" style={{
                transform: store.transform,
                width: store.width + "px",        // set width
                height: store.height + "px",      // set height
                position: "absolute" //absolute positioning so that other nodes aren't affected by transform/resizing!
            }}>
                <TopBar store={store}/>
                <div className="scroll-box">
                    <div className="content">
                        <h3 className="title">{store.title}</h3>
                        <video src={store.url} controls />
                    </div>
                </div>
                <ResizeHandle store={store} />
            </div>
        );
    }
}