import { observer } from "mobx-react";
import * as React from 'react';
import { NodeCollectionStore, StaticTextNodeStore, StoreType, VideoNodeStore } from "../../stores";
import { TextNodeView, VideoNodeView } from "../nodes";
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
