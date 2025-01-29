import React from "react";
import "./RemoveButton.scss";
import { REMOVE_BTN_SYMBOL } from "../../Constants";
import { NodeStore, NodeCollectionStore } from "../../stores";

/**Defines the props interface for a RemoveButton
 * 
 */
interface RemoveButtonProps {
  /**
   * A callback function that is triggered when the button is clicked.
   * Defines behavior of the remove button when clicked
   */
  node : NodeStore
  collection? : NodeCollectionStore
}

/**Defines a RemoveButton class component,
 * which is a styled red square pinned to the top right of a node.
 * Clicking the remove button allows the user to remove the node from the parent collection.
 */
export class RemoveButton extends React.Component<RemoveButtonProps> {
   
  onClickRemove = () => {
      if (this.props.collection){
        this.props.collection.removeNode(this.props.node);
      }  
  };
  

/**This methood renders the RemoveButton component*/
  render() {
    return (
      <button className="remove-button" onClick={this.onClickRemove}> {/**Standard html for a button*/}
        {REMOVE_BTN_SYMBOL}
      </button>
    );
  }
}
