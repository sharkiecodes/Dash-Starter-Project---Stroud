

import { observer } from "mobx-react";
import { observable } from "mobx";
import React from "react";
import { NodeCollectionStore, NodeStore, StoreType } from "../../../../stores";
import "./TreeNodeItem.scss";


interface TreeNodeItemProps {
    node: NodeStore;
    parentStore: NodeCollectionStore; // so we can remove or link, etc.
  }
    
/**
 * A separate class component that renders a single node in the tree.
 * If the node is another NodeCollectionStore, we can recursively
 * render its children below.
 */
 @observer
export  class TreeNodeItem extends React.Component<TreeNodeItemProps> {
    @observable
    private expanded : boolean = true; //represents whether a collection is expanded or not
    
    /**Toggles expanded status */
    onToggle = () => {
      this.expanded = !this.expanded;
    };

   /**Removes itself from parent store */
    onRemove = () => {
      this.props.parentStore.removeNode(this.props.node);
    };
  
    render() {
      const { node } = this.props; //gets the corresponding node from this.props, for easy reference
      const expanded = this.expanded;
      const isCollection = (node.type == StoreType.Collection);
  
      // A title if it has one, or fallback to type
      const title = node.title || StoreType[node.type ?? StoreType.Text];
  
      return (
        <li className="tree-node-item">
          <div className="tree-node-line">
            {isCollection && (
              <button className="toggle-btn" onClick={this.onToggle}> {/*Show the drop-down toggle button if it's a collection */}
                {expanded ? "▼" : "▶"}
              </button>
            )}
  
            <span className="node-title">{title}</span>
            <button className="remove-btn" onClick={this.onRemove}>
              Remove
            </button>
          </div>
  
          {isCollection && expanded && (
            <div className="tree-children">
              {/**
               * Because it’s a collection, we also want to show any children in a nested <ul>.
               * This is a recursive call if the child is also a collection.
               */}
              <ul>
                {(node as NodeCollectionStore).nodes.map((child) => (
                  <TreeNodeItem
                    key={child.Id}
                    node={child}
                    parentStore={node as NodeCollectionStore}
                  />
                ))}
              </ul>
            </div>
          )}
        </li>
      );
    }
  }
  