

import { observer } from "mobx-react";
import React from "react";
import { NodeCollectionStore, NodeStore, StoreType } from "../../../../stores";
import "./TreeNodeItem.scss";
import { observable } from "mobx";
/**
 * A separate class component that renders a single node in the tree.
 * If the node is another NodeCollectionStore, we can recursively
 * render its children below.
 */
interface TreeNodeItemProps {
    node: NodeStore;
    parentStore: NodeCollectionStore; // so we can remove or link, etc.
  }
  
  
 @observer
export  class TreeNodeItem extends React.Component<TreeNodeItemProps> {
    @observable
    private expanded : boolean = true;
  
    onToggle = () => {
      this.expanded = !this.expanded;
    };
  
    onRemove = () => {
      this.props.parentStore.removeNode(this.props.node);
    };
  
    render() {
      const { node, parentStore } = this.props;
      const expanded = this.expanded;
      const isCollection = (node.type == StoreType.Collection);
  
      // A title if it has one, or fallback to type
      const title = node.title || StoreType[node.type ?? StoreType.Text];
  
      return (
        <li className="tree-node-item">
          <div className="tree-node-line">
            {isCollection && (
              <button className="toggle-btn" onClick={this.onToggle}>
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
  