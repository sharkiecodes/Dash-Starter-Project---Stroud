import { observer } from "mobx-react";
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";  
import { RichTextNodeStore } from "../../../stores/RichTextNodeStore";
import { TopBar } from "../TopBar";
import { ResizeHandle } from "../ResizeHandle";
import './RichTextNodeView.scss';

@observer
export class RichTextNodeView extends React.Component<{ store: RichTextNodeStore }> {

    onEditorChange = (value: string) => {
        this.props.store.content = value;
    }

    render() {
        const store = this.props.store;
        return (
            <div
                className="node richtext-node"
                style={{
                    transform: store.transform,
                    width: store.width + "px",
                    height: store.height + "px",
                    position: "absolute"
                }}
            >
               
                <TopBar store={store} />

        
                <div className="scroll-box">
                    <div className="content">
                        <h3 className="title">{store.title}</h3>

                        <div className="quill-container">
                            <ReactQuill
                    
                                value={store.content}
                                onChange={this.onEditorChange}
                                theme="snow"
                                style={{ height: "100%" }}
                                bounds={".quill-container"} 
                                
                            />
                        </div>
                    
                    </div>
                </div>
                
                <ResizeHandle store={store} />
            </div>
        );
    }
}
