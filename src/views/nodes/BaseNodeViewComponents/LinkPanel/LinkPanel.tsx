// LinkPanel.tsx
import * as React from "react";
import "./LinkPanel.scss";
import { NodeStore, NodeCollectionStore } from "../../../../stores";
import { observer } from "mobx-react";
import { StoreType } from "../../../../stores";
import { observable } from "mobx";
interface LinkPanelProps {
  node: NodeStore;                  // the node for which we're displaying links
  collection: NodeCollectionStore;  // parent store for all nodes
   // a callback for "follow link," so we do the centering in the parent (if in Freeform view) or highlighting the linked node (if in Grid view)
   onFollowLink?: (node: NodeStore) => void;
}

  
@observer
export class LinkPanel extends React.Component<LinkPanelProps> {

  @observable
  private selectedLinkId: string = "";


    onPointerDown = (e: React.PointerEvent) => {
      e.stopPropagation();
      /**Necessary to stop propagation, otherwise the freeform canvas could interpret
       * the click as an attempt to pan, and would consider the pointer to be down.
       */
    }
  /** Center the canvas on the linked node (or do any other "follow" action). */
  handleFollowLink = (linkedNode: NodeStore) => {
    if (this.props.onFollowLink) {
      this.props.onFollowLink(linkedNode);
    }
  };

  /** Track user’s choice in the link dropdown. */
  handleLinkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.selectedLinkId = e.target.value;
  };

  /** Actually link the current node to the selected node from the dropdown. */
  handleAddLink = () => {
    const { node, collection } = this.props;
    if (!this.selectedLinkId) return;

    const target = collection.nodes.find((n) => n.Id === this.selectedLinkId);
    if (target && target !== node) {
      node.linkTo(target);
      // Optionally reset the dropdown after linking:
      this.selectedLinkId = "";
    }
  };

  render() {
    const { node, collection } = this.props;
    // Filter out the current node itself so we don't link to ourselves
    // If we have a collection, only allow linking to nodes in that collection (excluding itself)
    const otherNodes = collection.nodes.filter((n) => n !== node);

    return (
      <div className="links-panel" onPointerDown={this.onPointerDown}>
        <h4>Links</h4>
        <ul>
          {node.links.map((linkedNode) => (
            <li key={linkedNode.Id}>
              {/**When labeling, consider edge cases where there is no title by displaying the first 3 digits of the node's id */}
               {linkedNode.type === null ? "Null" : StoreType[linkedNode.type]} - {linkedNode.title || "Untitled Node " + linkedNode.Id.at(0) + linkedNode.Id.at(1) + linkedNode.Id.at(2)}
              <button onClick={() => this.handleFollowLink(linkedNode)}>
                Follow
              </button>
              &nbsp;
              <button onClick={() => node.unlink(linkedNode)}>Unlink</button>
            </li>
          ))}
        </ul>

        <select value={this.selectedLinkId} onChange={this.handleLinkChange}>
          <option value="">-- Link to another node --</option>
          {otherNodes.map((n) => (
            <option key={n.Id} value={n.Id}>
              {n.title || "Untitled Node " + n.Id.at(0) + n.Id.at(1) + n.Id.at(2)} 
              {/*Unnamed node with random shortened 3digit id
              the OR operator will use the right-hand side whenever the left-hand side is null or ""*/}
            </option>
          ))}
        </select>
        <button onClick={this.handleAddLink}>+ Link</button>
      </div>
    );
  }
}
