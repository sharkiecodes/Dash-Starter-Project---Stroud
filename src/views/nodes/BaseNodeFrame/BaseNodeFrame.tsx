// BaseNodeFrame.tsx
import * as React from "react";
import { NodeStore } from "../../../stores";
import { TopBar, RemoveButton, ResizeHandle, LinkPanel } from ".././BaseNodeViewComponents";
import { BaseNodeProps } from "./BaseNodeProps";
import "./../NodeView.scss";

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
 * Because each NodeView has a renderContent method, each NodeView knows how to render its own
 * content. It then renders its content inside the BaseNodeFrame, but the renderContent method also further allows CompositeNode
 * to fetch the raw content from a node. Basically, the BaseNodeFrame class works in conjunction
 * with a NodeView's renderContent method to make it simple whether
 * or not to render a view with a frame.
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
          <LinkPanel node={store} collection={collection} onFollowLink={onFollowLink}/> //Shows a linkpanel so long as there is a collection
        )}

        <div className="scroll-box">
          <div className="content">{children}</div>
        </div>

        <ResizeHandle store={store} />
      </>
    );
  }
}
