// NodeRendererClass.tsx
import * as React from "react";
import {
  NodeStore,
  StoreType,
  StaticTextNodeStore,
  VideoNodeStore,
  ImageNodeStore,
  WebsiteNodeStore,
  RichTextNodeStore,
  NodeCollectionStore,
  CompositeNodeStore,
  ScrapbookNodeStore
} from "../../stores";
import {
  TextNodeView,
  CollectionNodeView,
  VideoNodeView,
  WebsiteNodeView,
  RichTextNodeView,
  ImageNodeView,
  CompositeNodeView,
  ScrapbookNodeView
} from "../nodes";


export enum RenderMode {
    Framed,
    ContentOnly
  }
  
interface NodeRendererProps {
  node: NodeStore;
  mode?: RenderMode;
  parentCollection?: NodeCollectionStore;
  onRemove?: () => void;
  onFollowLink?: (node: NodeStore) => void;
  onDragStart?: (node: NodeStore, e: PointerEvent) => void;
  onDrag?: (node: NodeStore, dx: number, dy: number, e: PointerEvent) => void;
  onDragEnd?: (node: NodeStore, e: PointerEvent) => void;
}

export class NodeRenderer extends React.Component<NodeRendererProps> {
  
  // Provide a helper so we don’t clutter `render()`.

  /**
   * 
   * we already have this in freeformcanvas, so maybe we not need the if/else?
   * onClickRemove = (childStore: NodeStore) => {
      this.props.store.removeNode(childStore);
    }; */
  private handleRemove = () => {
    const { node, onRemove, parentCollection } = this.props;
    if (onRemove) {
      onRemove();
    } else if (parentCollection) {
      parentCollection.removeNode(node);
    }
  };

  render() {
    const { mode = RenderMode.Framed, node, parentCollection, onFollowLink, onDrag, onDragStart, onDragEnd } = this.props;
    

    // Otherwise, do the "framed" switch:
    switch (node.type) {
      case StoreType.Composite:
        return ( 
          <CompositeNodeView
            store={node as CompositeNodeStore}
            onRemove={this.handleRemove}
            collection={parentCollection}
            onFollowLink={onFollowLink}
            onDragStart={onDragStart}
            onDrag={onDrag}
            onDragEnd={onDragEnd}
          />
        );
      case StoreType.Text:
        return (
          <TextNodeView
            store={node as StaticTextNodeStore}
            onRemove={this.handleRemove}
            collection={parentCollection}
            onFollowLink={onFollowLink}
            onDrag={onDrag}
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
          />
        );
      case StoreType.Video:
        return (
          <VideoNodeView
            store={node as VideoNodeStore}
            onRemove={this.handleRemove}
            collection={parentCollection}
            onFollowLink={onFollowLink}
            onDrag={onDrag}
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
          />
        );
      case StoreType.Image:
        return (
          <ImageNodeView
            store={node as ImageNodeStore}
            onRemove={this.handleRemove}
            collection={parentCollection}
            onFollowLink={onFollowLink}
            onDrag={onDrag}
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
          />
        );
      case StoreType.Website:
        return (
          <WebsiteNodeView
            store={node as WebsiteNodeStore}
            onRemove={this.handleRemove}
            collection={parentCollection}
            onFollowLink={onFollowLink}
            onDrag={onDrag}
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
          />
        );
      case StoreType.RichText:
        return (
          <RichTextNodeView
            store={node as RichTextNodeStore}
            onRemove={this.handleRemove}
            collection={parentCollection}
            onFollowLink={onFollowLink}
            onDrag={onDrag}
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
          />
        );
      case StoreType.Collection:
        return (
          <CollectionNodeView
            store={node as NodeCollectionStore}
            onRemove={this.handleRemove}
            collection={parentCollection}
            onFollowLink={onFollowLink}
            onDrag={onDrag}
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
          />
        );
        case StoreType.Scrapbook:
            return (
              <ScrapbookNodeView
                store={node as ScrapbookNodeStore}
                onRemove={this.handleRemove}
                collection={parentCollection}
                onFollowLink={onFollowLink}
                onDrag={onDrag}
                onDragEnd={onDragEnd}
                onDragStart={onDragStart}
              />)
      default:
        return null;
    }
  }
}
