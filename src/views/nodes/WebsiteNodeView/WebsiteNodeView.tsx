import { observer } from "mobx-react";
import * as React from 'react';
import { WebsiteNodeStore } from "../../../stores";
import { TopBar } from "../TopBar";
import { ResizeHandle } from "../ResizeHandle";
import "./../NodeView.scss";
import "./WebsiteNodeView.scss";

interface WebsiteNodeProps {
    store: WebsiteNodeStore;
}

@observer
export class WebsiteNodeView extends React.Component<WebsiteNodeProps> {


    render() {
        const store = this.props.store; //fetches the store for easy reference later on
        return (
    
            <div
                className="node websiteNode"
                style={{
                    transform: store.transform,
                    width: store.width + "px",        // set width
                    height: store.height + "px", 
                    position: "absolute" // So that it doesn't push other components around
                }}
            >
                {/* The existing top bar for dragging */}
                <TopBar store={store}/>

                <div className="scroll-box">
                    <div className="content">
                        {/* A title for  embedded website */}
                        <h3 className="title">{store.title}</h3>

                        {/* The iframe for the website URL */}
                        <iframe className = "iframe" title = {store.title}
                            src={store.websiteURL}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            //allowing certain attributes
                        />
                    </div>
                </div>

                <ResizeHandle store={store} />
            </div>
        );
    }
}
