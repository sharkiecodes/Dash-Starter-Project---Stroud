import { observer } from "mobx-react";
import * as React from "react";
import { ImageNodeStore } from "../../../stores/ImageNodeStore";
import { TopBar } from "../TopBar";
import { ResizeHandle } from "../ResizeHandle"; 
import "./../NodeView.scss";
import "./ImageNodeView.scss";

interface ImageNodeProps {
    store: ImageNodeStore;
}

@observer
export class ImageNodeView extends React.Component<ImageNodeProps> {
    render() {
        const store = this.props.store;

        return (
            <div
                className="node imageNode"
                style={{
                    transform: store.transform,
                    width: store.width + "px",
                    height: store.height + "px",
                    position: "absolute"
                }}
            >
                {/* Drag handle (TopBar) */}
                <TopBar store={store} />

                <div className="scroll-box">
                    <div className="content">
                        {/*  title or image caption */}
                        <h3 className="title">{store.title}</h3>
                        <br></br>
                        <br></br>
                        {/* The actual image */}
                        {store.url && (
                            <img src={store.url} alt={store.title} style={{ maxWidth: "100%", maxHeight: "100%" }} /> // shows image if not null
                        )}
                    </div>
                </div>

                {/* resize handle */}
                <ResizeHandle store={store} />
            </div>
        );
    }
}
