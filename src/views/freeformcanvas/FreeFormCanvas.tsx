import { observer } from "mobx-react";
import * as React from 'react';
import { NodeCollectionStore, GroupNodeStore, StaticTextNodeStore, StoreType, VideoNodeStore, WebsiteNodeStore, RichTextNodeStore, ImageNodeStore } from "../../stores";
import { TextNodeView, GroupNodeView, VideoNodeView, WebsiteNodeView, RichTextNodeView, ImageNodeView } from "../nodes";
import "./FreeFormCanvas.scss";

interface FreeFormProps {
    store: NodeCollectionStore
}

@observer
export class FreeFormCanvas extends React.Component<FreeFormProps> {

    private isPointerDown: boolean | undefined;

    onPointerDown = (e: React.PointerEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        this.isPointerDown = true;
        document.removeEventListener("pointermove", this.onPointerMove);
        document.addEventListener("pointermove", this.onPointerMove);
        document.removeEventListener("pointerup", this.onPointerUp);
        document.addEventListener("pointerup", this.onPointerUp);
    }

    onPointerUp = (e: PointerEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        this.isPointerDown = false;
        document.removeEventListener("pointermove", this.onPointerMove);
        document.removeEventListener("pointerup", this.onPointerUp);
    }

    onPointerMove = (e: PointerEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        if (!this.isPointerDown) return;

        this.props.store.x += e.movementX;
        this.props.store.y += e.movementY;
    }

    render() {
        let store = this.props.store;
        return (
            <div className="freeformcanvas-container" onPointerDown={this.onPointerDown}>
                <div className="freeformcanvas" style={{ transform: store.transform }}>
                    {   
                        // maps each item in the store to be rendered in the canvas based on the node type
                        store.nodes.map(nodeStore => {
                            switch (nodeStore.type) {
                                case StoreType.Text:
                                    return (<TextNodeView key={nodeStore.Id} store={nodeStore as StaticTextNodeStore}/>)

                                case StoreType.Video:
                                    return (<VideoNodeView key={nodeStore.Id} store={nodeStore as VideoNodeStore}/>)

                                case StoreType.Website:
                                    return (<WebsiteNodeView key={nodeStore.Id} store={nodeStore as WebsiteNodeStore}/>)    

                                case StoreType.RichText:
                                    return (<RichTextNodeView key={nodeStore.Id} store={nodeStore as RichTextNodeStore}/>);
                               
                                case StoreType.Image:
                                    return (<ImageNodeView key={nodeStore.Id} store={nodeStore as ImageNodeStore}/>);     
                                
                                case StoreType.Collection:
                                    return (
                                        <GroupNodeView key={nodeStore.Id} store={nodeStore as GroupNodeStore} />
                                    );    

                                default:
                                    return (null);
                            }
                        })
                    }
                </div>
            </div>
        );
    }
}
