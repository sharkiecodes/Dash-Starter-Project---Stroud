import { observer } from "mobx-react";
import * as React from 'react';
import { VideoNodeStore } from "../../../stores";
import "./../NodeView.scss";
import "./VideoNodeView.scss";
import { BaseNodeProps } from "../BaseNodeFrame/BaseNodeProps";
import { BaseNodeFrame } from "../BaseNodeFrame/BaseNodeFrame";

interface VideoNodeProps extends BaseNodeProps<VideoNodeStore>{};

@observer
export class VideoNodeView extends React.Component<VideoNodeProps> {

    private renderContent = () => {
        const store = this.props.store;
        return (<> 
            <h3 className="title">{store.title}</h3>
            <video src={store.url} controls /></>
        )
    }
    
    render() {
        const { store, collection, onFollowLink, onDrag, onDragEnd, onDragStart, isContentOnly } = this.props;
      if(isContentOnly){
        return this.renderContent();        
      }
      else{
        return (
            <div className="node videoNode" id={`node-${store.Id}`}  style={{
                transform: store.transform,
                width: store.width + "px",        // set width
                height: store.height + "px",      // set height
                position: "absolute" //absolute positioning so that other nodes aren't affected by transform/resizing!
            }} >
                <BaseNodeFrame store = {store} collection={collection} onFollowLink = {onFollowLink} onDrag = {onDrag} onDragEnd = {onDragEnd} onDragStart ={onDragStart}>
                    {this.renderContent()}
                </BaseNodeFrame>
            </div>
        );
        }
    }
}