import { observer } from "mobx-react";
import * as React from 'react';
import { NodeStore } from "../../../stores";
import "./ResizeHandle.scss";
import { MINIMUM_NODE_HEIGHT, MINIMUM_NODE_WIDTH } from "../../../Constants";

interface ResizeHandleProps {
    store: NodeStore;
    
}
/**WILL FULLY COMMENT LATER */
@observer
export class ResizeHandle extends React.Component<ResizeHandleProps> {
    private isPointerDown = false;


    onPointerDown = (e: React.PointerEvent): void => {

        //if (e.currentTarget.classList.contains("resize-handle")) {
            e.stopPropagation();
            e.preventDefault();
        //}
        this.isPointerDown = true;
        
        /**Similar event listener logic as dragging the freeform canvas, where clicking adds event listeners for 
         * cursor movement and cursor release
        */
        document.removeEventListener("pointermove", this.onPointerMove); 
        document.addEventListener("pointermove", this.onPointerMove);

        document.removeEventListener("pointerup", this.onPointerUp);
        document.addEventListener("pointerup", this.onPointerUp);
    }

   
    onPointerMove = (e: PointerEvent): void => {
        if (!this.isPointerDown) return;
        e.stopPropagation();
        e.preventDefault();


        // Increase width/height by the movement
        this.props.store.width! += e.movementX;
        this.props.store.height! += e.movementY;

        // Minimum size
        if (this.props.store.width! < MINIMUM_NODE_WIDTH) {
            this.props.store.width = MINIMUM_NODE_WIDTH;
        }
        if (this.props.store.height! < MINIMUM_NODE_HEIGHT) {
            this.props.store.height = MINIMUM_NODE_HEIGHT;
        }
    }

    onPointerUp = (e: PointerEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        this.isPointerDown = false;

        document.removeEventListener("pointermove", this.onPointerMove);
        document.removeEventListener("pointerup", this.onPointerUp);
    }

    render() {
        // A bottom-right square to grab & resize
        return (
            <div 
                className="resize-handle"
                onPointerDown={this.onPointerDown}
            />
        );
    }
}
