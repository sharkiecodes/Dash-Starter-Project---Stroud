import React from "react";
import "./RemoveButton.scss";
import { REMOVE_BTN_SYMBOL } from "../../Constants";

/**Defines the props interface for a RemoveButton
 * 
 */
interface RemoveButtonProps {
  /**
   * A callback function that is triggered when the button is clicked.
   * Defines behavior of the remove button when clicked
   */
  onClick : () => void 
}

/**Defines a RemoveButton class component,
 * which is a styled red square pinned to the top right of a node.
 * Clicking the remove button allows the user to remove the node from the parent collection.
 */
export class RemoveButton extends React.Component<RemoveButtonProps> {

/**This methood renders the RemoveButton component*/
  render() {
    const onClick = this.props.onClick;
    return (
      <button className="remove-button" onClick={onClick}> {/**Standard html for a button*/}
        {REMOVE_BTN_SYMBOL}
      </button>
    );
  }
}
