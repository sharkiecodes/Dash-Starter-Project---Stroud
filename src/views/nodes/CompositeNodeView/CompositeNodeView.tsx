// CompositeNodeView.tsx
import { observer } from "mobx-react";
import * as React from 'react';
import { CompositeNodeStore } from "../../../stores/CompositeNodeStore";
import { BaseNodeFrame } from "../BaseNodeFrame/BaseNodeFrame";
import { BaseNodeProps } from "../BaseNodeFrame/BaseNodeProps";
import { renderNodeContentOnly } from "../NodeContentRenderer/NodeContentRenderer";
import "./CompositeNodeView.scss";


interface CompositeNodeProps extends BaseNodeProps<CompositeNodeStore> {
}

/**
 * Renders multiple child nodes in a single node frame. 
 * Stacked
 */
@observer
export class CompositeNodeView extends React.Component<CompositeNodeProps> {

  renderContent  = () => {
    //  
    //   there is a “renderContent()” method on each node’s view,
    //    you can call it directly.
    const {store} = this.props;
   
    return (
        <>
          <h3 className="title">{store.title}</h3>
          {store.childNodes.map(child => (
            <div key={child.Id} className="composite-sub-child">
               {renderNodeContentOnly(child)}
            </div>
          ))}
        </>
      );

  }

  render() {
    const { store, onRemove, collection, onFollowLink, onDrag, onDragEnd, onDragStart } = this.props;

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
          onRemove={onRemove}
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
