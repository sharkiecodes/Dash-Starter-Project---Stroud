// BaseNodeFrame.tsx
import * as React from "react";
import { NodeStore } from "../../../stores";
import { TopBar } from "../TopBar";
import { RemoveButton } from "../../RemoveButton";
import { ResizeHandle } from "../ResizeHandle";
import { LinkPanel } from "../LinkPanel";
import { BaseNodeProps } from "./BaseNodeProps";
import "./../NodeView.scss"; //??

interface BaseNodeFrameProps extends BaseNodeProps<NodeStore> {
  children?: React.ReactNode; // the unique content
}
 

/**
 * A compositional component that renders
 * the repeated frame: top bar, remove button,
 * link panel, scroll-box, resize handle, etc.
 * The actual “node content” is `this.props.children`.
 * 
 * Design Justification:
 * Reduces repetition of base frame components
 * Is similar in concept to Dash's DocView, which renders standard components of a document's view
 * 
 * Each NodeView represents the node's layout and content information
 * By implementing the renderContent method defined in the XX interface, each NodeView knows how to render its own
 * content. It renders its content inside the BaseNodeFrame, but this method is also public, meaning CompositeNode
 * can call it in order to fetch the content from this type of node.
 */
export class BaseNodeFrame extends React.Component<BaseNodeFrameProps> {
  render() {
    const { store, children, collection, onFollowLink, onDragStart, onDrag, onDragEnd} = this.props;

    return (
      <>
        <TopBar store={store} onDragStart={onDragStart}
                  onDrag={onDrag}
                  onDragEnd={onDragEnd} />
        <RemoveButton collection={collection} node = {store}/>
        
        {collection && (
          <LinkPanel node={store} collection={collection} onFollowLink={onFollowLink}/>
        )}

        <div className="scroll-box">
          <div className="content">{children}</div>
        </div>

        <ResizeHandle store={store} />
      </>
    );
  }
}
