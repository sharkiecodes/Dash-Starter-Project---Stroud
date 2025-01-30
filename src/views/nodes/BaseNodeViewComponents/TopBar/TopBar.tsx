import { observer } from "mobx-react";
import * as React from 'react';
import { NodeStore } from "../../../../stores";
import "./TopBar.scss";

interface TopBarProps {
    store: NodeStore;
    onDragStart?: (node: NodeStore, e: PointerEvent) => void;
    onDrag?: (node: NodeStore, dx: number, dy: number, e: PointerEvent) => void;
    onDragEnd?: (node: NodeStore, e: PointerEvent) => void;
}

@observer
export class TopBar extends React.Component<TopBarProps> {

    private isPointerDown = false;
    

    onPointerDown = (e: React.PointerEvent<HTMLDivElement>): void => {
        // only do stopPropagation if the user is grabbing the top bar
        if (e.currentTarget.classList.contains("topbar")) {
            e.stopPropagation();
            e.preventDefault();
        // start drag, etc.
        }
        this.isPointerDown = true;
        // Let parent know we've started dragging this node
        const pointerEvent = e.nativeEvent as PointerEvent;
        this.props.onDragStart?.(this.props.store, pointerEvent);

        document.removeEventListener("pointermove", this.onPointerMove);
        document.addEventListener("pointermove", this.onPointerMove);
        document.removeEventListener("pointerup", this.onPointerUp);
        document.addEventListener("pointerup", this.onPointerUp);
    }

    onPointerUp = (e: PointerEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        this.isPointerDown = false;
        // Let parent know we've ended dragging
        this.props.onDragEnd?.(this.props.store, e);
        document.removeEventListener("pointermove", this.onPointerMove);
        document.removeEventListener("pointerup", this.onPointerUp);
    }

    onPointerMove = (e: PointerEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        if (!this.isPointerDown) return;
            // Instead of directly setting store.x/store.y,
        // we forward the movement to FreeFormCanvas:
        this.props.onDrag?.(this.props.store, e.movementX, e.movementY, e);
        //this.props.store.x += e.movementX;
        //this.props.store.y += e.movementY;

    }

    render() {
        return <div className="topbar" onPointerDown={this.onPointerDown} />
        
    }
}
