import { observer } from "mobx-react";
import * as React from "react";
import { ImageNodeStore } from "../../../stores/ImageNodeStore";
import "./../NodeView.scss";
import "./ImageNodeView.scss";
import { BaseNodeProps } from "../BaseNodeFrame/BaseNodeProps";
import { BaseNodeFrame } from "../BaseNodeFrame/BaseNodeFrame";
interface ImageNodeProps extends BaseNodeProps<ImageNodeStore>{};

/**Represents an ImageNodeView */
@observer
export class ImageNodeView extends React.Component<ImageNodeProps> {

    private renderContent = () => {
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

    render() {
        const {store, collection, onFollowLink, onDrag, onDragEnd, onDragStart, isContentOnly} = this.props; //destructure props
        if (isContentOnly){
            return this.renderContent();
        }   
        else{    
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
              <BaseNodeFrame store = {store} collection = {collection} onFollowLink = {onFollowLink} onDrag = {onDrag} onDragEnd = {onDragEnd} onDragStart ={onDragStart}>
              {this.renderContent()}
              </BaseNodeFrame>

            </div>
        );
      }
    }
}
