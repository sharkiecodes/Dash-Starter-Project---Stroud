import { observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import { StoreType } from "../../stores";
import { AddNodeModal } from "../AddNodeModal/AddNodeModal";
import { NodeStore, NodeCollectionStore } from "../../stores";
import { RANDOM_LOCATION_FACTOR } from "../../Constants";
import "./AddNodeToolbar.scss";

/**The interface for the props of an Add Node toolbar */
interface AddNodeToolbarProps {
    /*The NodeCollectionStore in which new nodes should be added. */
    store: NodeCollectionStore;
  }

/**
 * A small toolbar that lets the user pick a node type and click "Add Child Node."
 * Internally manages which type is selected, whether the modal is showing, etc.
 */
@observer
export class AddNodeToolbar extends React.Component<AddNodeToolbarProps> {

    /*Boolean representing whether or not to show the Add Node form. 
    Defaults to false because it should not be open right away.*/
    @observable
    private showAddModal: boolean = false; 
            
    @observable
    private newNodeType: StoreType = StoreType.Text; // The node type the user selects when creating a new child, default to text
              
  
    private generateInitialPos = () => {
      const store = this.props.store; //for easy access

     // place the new node somewhere in the top-left quadrant
     let randX = Math.random() * (store.width / RANDOM_LOCATION_FACTOR);
     let randY = Math.random() * (store.height / RANDOM_LOCATION_FACTOR);
     // But we must also account for panning (store.x, store.y).
     // Since the store.x / store.y is used as a "translate" in CSS,
     // subtract them from localX, localY:
     return [randX - this.props.store.panX, randY - this.props.store.panY]
      /*Adding at an adjusted (x,y) is better because
      * adding it an arbitrary (x,y), even if it's upper left corner,
      * could mean that you could pan away and not find it
      */

    }
    render() {

    const store = this.props.store; //for easy access
    const [randX, randY] = this.generateInitialPos(); //destructure

    return(
    <div className = "add-child-ui-wrapper">
      {/*Add child node UI. Allows the user to create any node that is not a composite node
      (those are created by drag-and-drop while holding shift key)
      */}    
      <div className="add-child-ui" >
            <select value={this.newNodeType} onChange={this.onChangeType} onPointerDown={this.removeFocus}>
              <option value={StoreType.Text}>Text</option>
              <option value={StoreType.Video}>Video</option>
              <option value={StoreType.Image}>Image</option>
              <option value={StoreType.Website}>Website</option>
              <option value={StoreType.RichText}>RichText</option>
              <option value={StoreType.Collection}>Collection</option>
              <option value={StoreType.Scrapbook}>Scrapbook</option>
            </select>
            <button onClick={this.onClickAddNode}>Add Child Node</button>
          </div>
             {/* Show AddNodeModal if needed 
             The boolean operator works such that if showAddModal is true, it will evaluate the righthand-side
             and display the addNodeModal*/}
             {this.showAddModal && (
          <AddNodeModal
            nodeType={this.newNodeType}
            onAdd={this.handleAddNode}
            onCancel={this.handleCancelAdd}
            locX = {randX} //Random node initial locations calculated earlier
            locY = {randY}
          />)}
          </div>
             )}
    /**Attached to the selection UI for adding a node.
     * Necessary to prevent any pointer events from propagating to the
     * freeform canvas. */        
    removeFocus = (e: React.PointerEvent) =>{
          e.stopPropagation();
          }

      // ---------------------------
      // Create/Remove Child Nodes
      // ---------------------------
      onChangeType = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // The <select> sets which node type we create
        this.newNodeType = Number(e.target.value); 
        /*The new node type is an enum of store types, which can also be referred to by numbers*/

      };

      /**Called after the user fills in the form and clicks "Create"*/
      handleAddNode = (newNode: NodeStore) => {

        // Actually add the node to the store
        this.props.store.addNode(newNode);
    
        // Close the modal
        this.showAddModal = false;
      };
    
      /**This is called if the user cancels the form
      *Closes the add node form.*/
      handleCancelAdd = () => {
        this.showAddModal = false;
      };
    
    /**
     * Updates the showAddModal boolean variable to true,
     * which displays the add node form.
     * @param e: the React MouseEvent
     */
      onClickAddNode = (e: React.MouseEvent<HTMLButtonElement>) => {
        this.showAddModal = true;
        return; 
        }
}


         