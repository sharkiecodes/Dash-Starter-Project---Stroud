import { observer } from "mobx-react";
import * as React from 'react';
import { NodeStore } from "../../../stores";
import "./TopBar.scss";

interface TopBarProps {
    store: NodeStore;
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
        return <div className="topbar" onPointerDown={this.onPointerDown} />
    }
}
