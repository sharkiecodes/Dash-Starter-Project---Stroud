// src/views/CanvasViews/GridView/GridCanvas.tsx
import React from "react";
import { observer } from "mobx-react";
import { observable } from "mobx";
import { NodeCollectionStore, NodeStore } from "../../../stores";
import { NodeRenderer } from "../../NodeRenderer/NodeRenderer";
import "./GridCanvas.scss";

interface GridCanvasProps {
  store: NodeCollectionStore;
}

/**
 * Displays the children of the given NodeCollectionStore in a grid.
 * Uses <NodeRenderer> for each node.
 */
@observer
export class GridCanvas extends React.Component<GridCanvasProps> {

  @observable
  private highlightedNodeId: string | null = null;

  /**
   * Called when a user “follows” a link in a child node.
   * We store the highlighted node’s ID so only that cell is visibly highlighted.
   */
  highlightCell = (node: NodeStore) => {

      this.highlightedNodeId = node.Id;
    }
    
  
  render() {
    const { store } = this.props;

    return (
      <div className="grid-canvas-container">
        <div className="grid-canvas">
          {store.nodes.map((child: NodeStore) => {
            // For each child, see if it is the highlighted node.
            const isHighlighted = child.Id === this.highlightedNodeId;
            // Conditionally add the .highlight class
            const gridClass = `grid-cell ${isHighlighted ? "highlight" : ""}`;
    
            return (
              <div key={child.Id}>
                {/* NodeRenderer automatically picks the correct NodeView */}
                <NodeRenderer
                  className={gridClass}
                  store={child}
                  collection={store} // So NodeRenderer can remove or link
                  isContentOnly={false}
                  onFollowLink={this.highlightCell} // Visually indicates that because it's a fixed grid, links can't be followed
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }}    
