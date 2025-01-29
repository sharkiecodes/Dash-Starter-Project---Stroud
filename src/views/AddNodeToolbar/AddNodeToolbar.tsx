import { observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import { StoreType } from "../../stores";
import { AddNodeModal } from "../nodes/AddNodeForm/AddNodeForm";
import { NodeStore, NodeCollectionStore } from "../../stores";
import "./AddNodeToolbar.scss";

interface AddNodeToolbarProps {
    /** The NodeCollectionStore in which new nodes should be added. */
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
              
  render() {
    let store = this.props.store;
     // Example approach: place the new node somewhere in the top-left quadrant
     let randX = Math.random() * (store.width / 1.5);
     let randY = Math.random() * (store.height / 1.5);
 
 
     // But we must also account for panning (store.x, store.y).
     // If your store.x / store.y is used as a "translate" in CSS,
     // subtract them from localX, localY:
     randX = randX - this.props.store.panX; //USED TO SAY  STORE.X
     randY = randY - this.props.store.panY;
     /**Adding at an adjusted (x,y) is better because
      * adding it an arbitrary x,y even if it's upper left corner,
      * could mean that you could pan away and not find it
      */

    return(
    <div className = "add-child-ui-wrapper">    
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
             {/* Show AddNodeModal if needed */}
             {this.showAddModal && (
          <AddNodeModal
            nodeType={this.newNodeType}
            onAdd={this.handleAddNode}
            onCancel={this.handleCancelAdd}
            locX = {randX}
            locY = {randY}
          />)}
          </div>
             )}
             removeFocus = (e: React.PointerEvent) =>{
                e.stopPropagation();
                //e.preventDefault();
                }

          // ---------------------------
            // Create/Remove Child Nodes
            // ---------------------------
            onChangeType = (e: React.ChangeEvent<HTMLSelectElement>) => {
              // The <select> sets which node type we create
              this.newNodeType = Number(e.target.value);
              //this.isPointerDown = false; 
              /**Necessary to 
              prevent the canvas from panning. Otherwise, it interprets the selection of a different node type
              as the mouse continuously being down / pressing or highlighting that box.  */
            };
          
            /**ADDED JAN27 */
            // This is called after the user fills in the form and clicks "Create"
            handleAddNode = (newNode: NodeStore) => {
              
              // Actually add the node to the store
              this.props.store.addNode(newNode);
          
              // Close the modal
              this.showAddModal = false;
            };
          
            // This is called if the user cancels the form
            handleCancelAdd = () => {
              this.showAddModal = false;
            };
          
            /**CONCLUDE JAN27 */
          
            onClickAddNode = (e: React.MouseEvent<HTMLButtonElement>) => {
              this.showAddModal = true;
              return; //COMEBACK
          
              }
}

         