// src/views/CanvasViews/GridView/GridCanvas.tsx
import React from "react";
import { observer } from "mobx-react";
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
  render() {
    const { store } = this.props;

    return (
      <div className="grid-canvas-container">
        <div className="grid-canvas">
          {store.nodes.map((child: NodeStore) => (
            <div key={child.Id} className="grid-cell">
              {/* NodeRenderer automatically picks the correct NodeView */}
              <NodeRenderer
                node={child}
                parentCollection={store} // So NodeRenderer can remove or link
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}
