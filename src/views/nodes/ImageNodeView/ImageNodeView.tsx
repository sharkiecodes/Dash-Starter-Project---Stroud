import { observer } from "mobx-react";
import * as React from "react";
import { ImageNodeStore } from "../../../stores/ImageNodeStore";
import "./../NodeView.scss";
import "./ImageNodeView.scss";
import { NodeCollectionStore } from "../../../stores";
import { BaseNodeProps } from "../BaseNodeFrame/BaseNodeProps";
import { BaseNodeFrame } from "../BaseNodeFrame/BaseNodeFrame";
interface ImageNodeProps extends BaseNodeProps<ImageNodeStore>{};
interface ImageContentProps{
    store : ImageNodeStore
}
@observer
export class ImageNodeContent extends React.Component<ImageContentProps>{
    render(){
        const store = this.props.store;
        return(<>
         {/*  title or image caption */}
         <h3 className="title">{store.title}</h3>
         <br></br>
         <br></br>
         {/* The actual image */}
         {store.url && (
             <img src={store.url} alt={store.title} style={{ maxWidth: "100%", maxHeight: "100%" }} /> // shows image if not null
         )}
         </>
        )
    }
}
@observer
export class ImageNodeView extends React.Component<ImageNodeProps> {

    render() {
        const {store, onRemove, collection, onFollowLink, onDrag, onDragEnd, onDragStart} = this.props; //destructure props

        return (
            <div
                className="node imageNode"  id={`node-${store.Id}`} 
                style={{
                    transform: store.transform,
                    width: store.width + "px",
                    height: store.height + "px",
                    position: "absolute"
                }}
            >
              <BaseNodeFrame store = {store} onRemove = {onRemove} collection = {collection} onFollowLink = {onFollowLink} onDrag = {onDrag} onDragEnd = {onDragEnd} onDragStart ={onDragStart}>
              <ImageNodeContent store = {store}/>
              </BaseNodeFrame>

            </div>
        );
    }
}
