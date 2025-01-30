// src/views/CanvasViews/TreeView/TreeCanvas.tsx

import { observer } from "mobx-react";
import React from "react";
import { NodeCollectionStore } from "../../../../stores";
import "./TreeCanvas.scss";
import { TreeNodeItem } from "../TreeNodeItem/TreeNodeItem";

interface TreeCanvasProps {
  store: NodeCollectionStore; //the store of nodes represented
}

/**
 * A class component that displays a hierarchical “tree” view
 * of a NodeCollectionStore and its children.
 */
@observer
export class TreeCanvas extends React.Component<TreeCanvasProps> {
  /**
   * Renders a hierarchical view of the nodes
   * As opposed to rendering using NodeRenderer to render
    nodes with their base frames, use TreeNodeItem to render
    each node in the collection as a tree node item */
  render() {
    const { store } = this.props;

    return (
      <div className="tree-canvas">
        <ul className="tree-root">
          {/*Maps every child in the store to a TreeNodeItem*/}
          {store.nodes.map((child) => (
            <TreeNodeItem key={child.Id} node={child} parentStore={store}/>
          ))}
        </ul>
      </div>
    );
  }
}
