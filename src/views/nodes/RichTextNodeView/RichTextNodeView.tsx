import { observer } from "mobx-react";
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";  
import { RichTextNodeStore } from "../../../stores/RichTextNodeStore";
import './RichTextNodeView.scss';
import { BaseNodeFrame } from "../BaseNodeFrame/BaseNodeFrame";
import { BaseNodeProps } from "../BaseNodeFrame/BaseNodeProps";

interface RichTextNodeProps extends BaseNodeProps<RichTextNodeStore>{};


@observer
export class RichTextNodeView extends React.Component<RichTextNodeProps> {

    
    onEditorChange = (value: string) => {
        this.props.store.content = value;
        
    }

    onPointerDown = (e: React.PointerEvent<HTMLDivElement>): void => {
            // only do stopPropagation if the user is grabbing the top bar
            if (e.currentTarget.classList.contains("quill-container")) {
                e.stopPropagation();
                /**Prevents panning and allows you to highlight text by clicking down and scrolling over text within the quill container */
            // start drag, etc.
            }
        
        }
    
    private renderContent = () => {
        const store = this.props.store;
        const uniqueQuillId = "quill-bounds-" + store.Id;
        return(
            <>
        <h3 className="title">{store.title}</h3>
                                <div
                                    className="quill-container"
                                    id={uniqueQuillId}
                                    onPointerDown={this.onPointerDown}
                                >
                                    <ReactQuill
                                        value={store.content}
                                        onChange={this.onEditorChange}
                                        theme="snow"
                                        style={{ height: "100%" }}
                                        //bounds={".quill-container"}
                                        bounds={"#" + uniqueQuillId} 
                                        
                                    />
                                </div>
                </>
        )
    }

    render() {
        const {store, collection, onFollowLink, onDrag, onDragEnd, onDragStart, isContentOnly} = this.props;
        if (isContentOnly){
            return this.renderContent();
        }
        else{    
        return (
            <div
                className="node richtext-node"  id={`node-${store.Id}`} 
                style={{
                    transform: store.transform,
                    width: store.width + "px",
                    height: store.height + "px",
                    position: "absolute"
                }}
            >
               <BaseNodeFrame store = {store} collection={collection} onFollowLink={onFollowLink} onDrag = {onDrag} onDragEnd = {onDragEnd} onDragStart ={onDragStart}>
                {this.renderContent()}
               
               </BaseNodeFrame>
               
        
            </div>
        );
        }
    }
}
/**note to self, for my own reference:
 * When you specify a CSS selector like .quill-container, Quill will look for the first matching element in the document (depending on how it resolves that selector). 
 * The link tooltip/popover is then positioned relative to that first container. 
 * As soon as you have two .quill-container elements, Quill might:

Still attach the tooltip to the first container it finds, or
Place the tooltip outside the second container’s visible area,
Make the second container’s tooltip unclickable or invisible (because it’s incorrectly placed or is being clipped). */