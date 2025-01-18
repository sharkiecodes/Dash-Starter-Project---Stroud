import { observer } from "mobx-react";
import React from "react";
import { TopBar } from "../TopBar";
import { ResizeHandle } from "../ResizeHandle";
import { GroupNodeStore, NodeStore, StaticTextNodeStore, StoreType, VideoNodeStore, WebsiteNodeStore, RichTextNodeStore, ImageNodeStore } from "../../../stores";
import { TextNodeView, VideoNodeView, WebsiteNodeView, RichTextNodeView, ImageNodeView } from "../../nodes";

import "./../NodeView.scss";
import "./GroupNodeView.scss";

interface GroupNodeProps {
    store: GroupNodeStore;
}

@observer
export class GroupNodeView extends React.Component<GroupNodeProps> {

    renderNode = (childStore: NodeStore) => {
        switch (childStore.type) {
            case StoreType.Text:
                return (
                    <TextNodeView key={childStore.Id} store={childStore as StaticTextNodeStore} />
                );
            case StoreType.Video:
                return (
                    <VideoNodeView key={childStore.Id} store={childStore as VideoNodeStore} />
                );
            case StoreType.Image:
                return (
                    <ImageNodeView key={childStore.Id} store={childStore as ImageNodeStore} />
                );
            case StoreType.Website:
                return (
                    <WebsiteNodeView key = {childStore.Id} store = {childStore as WebsiteNodeStore} />
                );
            case StoreType.RichText:
                return (
                    <RichTextNodeView key = {childStore.Id} store = {childStore as RichTextNodeStore} />
        
                );
            case StoreType.Collection:
                // NESTED collection (recursively show another GroupNodeView)
                return (
                    <GroupNodeView
                 key={childStore.Id} store={childStore as GroupNodeStore} />
                );
            default:
                return null;
        }
    }

    render() {
        const store = this.props.store;

        return (
            <div
                className="node collectionNode"
                style={{
                    transform: store.transform,
                    width: store.width + "px",
                    height: store.height + "px",
                    position: "absolute"
                }}
            >
                {/* The top bar so you can drag the collection around */}
                <TopBar store={store} />

                {/* The interior "freeform" area for this nested collection */}
                <div className="collection-content">
                    <h3 className="title">{store.title}</h3>
                    {
                        store.nodes.map(childStore => 
                            this.renderNode(childStore)
                        )
                    }
                </div>


                <ResizeHandle store={store} />
            </div>
        );
    }
}
