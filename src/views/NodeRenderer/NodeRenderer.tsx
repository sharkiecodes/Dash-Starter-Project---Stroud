// NodeRendererClass.tsx
import * as React from "react";
import {StoreType, StaticTextNodeStore, VideoNodeStore, ImageNodeStore, WebsiteNodeStore, RichTextNodeStore, NodeCollectionStore, CompositeNodeStore, ScrapbookNodeStore} from "../../stores";
import {TextNodeView, CollectionNodeView, VideoNodeView, WebsiteNodeView, RichTextNodeView, ImageNodeView, CompositeNodeView, ScrapbookNodeView} from "../nodes";
import { BaseNodeProps } from "../nodes/BaseNodeFrame/BaseNodeProps";
import "./NodeRenderer.scss"


interface NodeRendererProps extends BaseNodeProps{
  className? : string
}

/** A helper class so we don’t clutter `render()`. */
export class NodeRenderer extends React.Component<NodeRendererProps> {
  
/**Renders the view for a node based on its type */
  renderView = () =>{
    const {store, onFollowLink, onDrag, onDragStart, onDragEnd, isContentOnly = false} = this.props;
    const parentCollection = this.props.collection
    switch (store.type) {
      case StoreType.Composite:
        return ( 
          <CompositeNodeView
            store={store as CompositeNodeStore}
            collection={parentCollection}
            onFollowLink={onFollowLink}
            onDragStart={onDragStart}
            onDrag={onDrag}
            onDragEnd={onDragEnd}
            isContentOnly = {isContentOnly}
          />
        );
      case StoreType.Text:
        return (
          <TextNodeView
            store={store as StaticTextNodeStore}
            collection={parentCollection}
            onFollowLink={onFollowLink}
            onDrag={onDrag}
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
            isContentOnly = {isContentOnly}
          />
        );
      case StoreType.Video:
        return (
          <VideoNodeView
            store={store as VideoNodeStore}
            collection={parentCollection}
            onFollowLink={onFollowLink}
            onDrag={onDrag}
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
            isContentOnly = {isContentOnly}
          />
        );
      case StoreType.Image:
        return (
          <ImageNodeView
            store={store as ImageNodeStore}
            collection={parentCollection}
            onFollowLink={onFollowLink}
            onDrag={onDrag}
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
            isContentOnly = {isContentOnly}
          />
        );
      case StoreType.Website:
        return (
          <WebsiteNodeView
            store={store as WebsiteNodeStore}
            collection={parentCollection}
            onFollowLink={onFollowLink}
            onDrag={onDrag}
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
            isContentOnly = {isContentOnly}
          />
        );
      case StoreType.RichText:
        return (
          <RichTextNodeView
            store={store as RichTextNodeStore}
            collection={parentCollection}
            onFollowLink={onFollowLink}
            onDrag={onDrag}
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
            isContentOnly = {isContentOnly}
          />
        );
      case StoreType.Collection:
        return (
          <CollectionNodeView
            store={store as NodeCollectionStore}
            collection={parentCollection}
            onFollowLink={onFollowLink}
            onDrag={onDrag}
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
            isContentOnly = {isContentOnly}
          />
        );
        case StoreType.Scrapbook:
            return (
              <ScrapbookNodeView
                store={store as ScrapbookNodeStore}
                collection={parentCollection}
                onFollowLink={onFollowLink}
                onDrag={onDrag}
                onDragEnd={onDragEnd}
                onDragStart={onDragStart}
                isContentOnly = {isContentOnly}
              />)
      default:
        return null;
    }

  }

  render() {
    const className = this.props.className;

    return (
      <div className={`view-node ${className ? ` ${className}` : ""}`}>
        {this.renderView()}
      </div>

    )
    
  }
}
