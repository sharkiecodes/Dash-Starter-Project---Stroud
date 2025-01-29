import { observer } from "mobx-react";
import * as React from 'react';
import { VideoNodeStore, NodeCollectionStore } from "../../../stores";
import "./../NodeView.scss";
import "./VideoNodeView.scss";
import { BaseNodeProps } from "../BaseNodeFrame/BaseNodeProps";
import { BaseNodeFrame } from "../BaseNodeFrame/BaseNodeFrame";
import { WebsiteNodeContent } from "../WebsiteNodeView";

interface VideoNodeProps extends BaseNodeProps<VideoNodeStore>{};
interface VideoNodeContentProps {
    store: VideoNodeStore
}
@observer
export class VideoNodeContent extends React.Component<VideoNodeContentProps>{
    public render(){
        const store = this.props.store;
        return (<> 
            <h3 className="title">{store.title}</h3>
            <video src={store.url} controls /></>
        )
    }
}
@observer
export class VideoNodeView extends React.Component<VideoNodeProps> {
    
    
    render() {
        const { store, onRemove, collection, onFollowLink, onDrag, onDragEnd, onDragStart } = this.props;
      
        return (
            <div className="node videoNode" id={`node-${store.Id}`}  style={{
                transform: store.transform,
                width: store.width + "px",        // set width
                height: store.height + "px",      // set height
                position: "absolute" //absolute positioning so that other nodes aren't affected by transform/resizing!
            }} >
                <BaseNodeFrame store = {store} onRemove={onRemove} collection={collection} onFollowLink = {onFollowLink} onDrag = {onDrag} onDragEnd = {onDragEnd} onDragStart ={onDragStart}>
                    <VideoNodeContent store = {store}/>
                </BaseNodeFrame>
            </div>
        );
    }
}