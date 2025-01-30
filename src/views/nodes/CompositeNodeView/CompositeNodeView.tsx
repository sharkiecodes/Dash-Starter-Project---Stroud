// CompositeNodeView.tsx
import { observer } from "mobx-react";
import * as React from 'react';
import { CompositeNodeStore } from "../../../stores/CompositeNodeStore";
import { BaseNodeFrame } from "../BaseNodeFrame/BaseNodeFrame";
import { BaseNodeProps } from "../BaseNodeFrame/BaseNodeProps";
import { NodeRenderer } from "../../NodeRenderer/NodeRenderer";
import "./CompositeNodeView.scss";


interface CompositeNodeProps extends BaseNodeProps<CompositeNodeStore> {
}

/**
 * Renders multiple child nodes in a single node frame. 
 * Stacks them by rendering their content only (without the BaseNodeFrame for each) 
 */
@observer
export class CompositeNodeView extends React.Component<CompositeNodeProps> {

  /**Renders the content (title and composite and sub nodes)
   * For each child node, renders its content only and arranges in the node
   */
  private renderContent = () =>{
    const {store} = this.props;
    return (
        <>
          <h3 className="title">{store.title}</h3>
          {store.childNodes.map(child => (
            <div key={child.Id} className="composite-sub-child">
               <NodeRenderer store = {child} isContentOnly = {true}/>
            </div>
          ))}
        </>
      );


  }

  render() {
    const { store, collection, onFollowLink, onDrag, onDragEnd, onDragStart, isContentOnly } = this.props;
    if (isContentOnly){
      return this.renderContent();
    }
    else{
    return (
      <div
        className="node compositeNode"
        id={`node-${store.Id}`}
        style={{
          transform: store.transform,
          width: store.width + "px",
          height: store.height + "px",
          position: "absolute"
        }}
      >
        <BaseNodeFrame
          store={store}
          collection={collection}
          onFollowLink={onFollowLink}
          onDrag={onDrag}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
         {this.renderContent()}
        </BaseNodeFrame>
      </div>
    );
  }
}
}
