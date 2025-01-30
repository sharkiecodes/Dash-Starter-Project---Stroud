// AddNodeModal.tsx
import * as React from "react";
import { observable } from "mobx";
import { NodeStore } from "../../stores";
import { StoreType } from "../../stores";
import { FieldDefinition } from "../../stores/FieldDefinition";
import { NodeConstructors } from "../../stores/NodeConstructors";
import './AddNodeModal.scss';
import { DEFAULT_NODE_HEIGHT, DEFAULT_NODE_WIDTH } from "../../Constants";
import { observer } from "mobx-react";



interface AddNodeModalProps {
  nodeType: StoreType;
  onAdd: (node: NodeStore) => void;
  onCancel: () => void;
  locX : number;
  locY: number;
}
/**Represents the Add Node popup,
 * which allows the user to enter information for a new node
 * Renders appropriate fields the user can enter based on the type of the class and its corresponding
 * field definitions.
 */
@observer
export class AddNodeModal extends React.Component<AddNodeModalProps> {

    @observable
    private fieldDefs: FieldDefinition[]; //fieldDefs: The array of FieldDefinition for the chosen node class
    @observable
    private formData: Record<string, any>; // formData: An object { [fieldName]: userValue }

    
  constructor(props: AddNodeModalProps) {

    super(props);

    // 1) Based on nodeType, find the corresponding class
    const NodeClass = NodeConstructors[props.nodeType]; 
    /*Necessary to avoid a big switch statement or if-else
    that would conditionally fetch field definitions */

    // 2) Gather all field definitions for that class (including inherited ones)
    this.fieldDefs = NodeClass.fieldDefinitions; //All nodes define an array of field definitions

    // 3) Build an initial formData from defaults
    const initialFormData: Record<string, any> = {};
    this.fieldDefs.forEach((fd) => {
      initialFormData[fd.name] = fd.defaultValue ?? "";
    });
    this.formData = initialFormData;


  }
  /**Handles a change in a form*/
  handleChange = (fieldName: string, value: any) => {
    this.formData[fieldName] = value;
    // Update for that specific field
    }
  /**Creates a new node and adds to parent collection through the onAdd callback*/
  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Build a new instance of the node using the formData
    const NodeClass = NodeConstructors[this.props.nodeType];

    // Pass these fields to the constructor
    const newNode = new NodeClass({
      ...this.formData,
      type: this.props.nodeType,
      x: this.props.locX,
      y: this.props.locY,
      height: DEFAULT_NODE_HEIGHT,
      width: DEFAULT_NODE_WIDTH,
    });

    // Invoke the callback to add the node to the canvas
    this.props.onAdd(newNode);
  };
  /**Renders input field for add node UI
   * @param fd The FieldDefinition the input is being rendererd for
   */
  renderInputFor(fd: FieldDefinition) {
    const value = this.formData[fd.name];

    switch (fd.inputType) {
      case "string":
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => this.handleChange(fd.name, e.target.value)}
          />
        );
      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => this.handleChange(fd.name, e.target.value)}
          />
        );
      case "textArea":
        return (
          <textarea
            value={value}
            onChange={(e) => this.handleChange(fd.name, e.target.value)}
          />
        );
      // Can extend to add more input types
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => this.handleChange(fd.name, e.target.value)}
          />
        );
    }
  }
      /**
      * This bars clicking other buttons, dragging nodes,
      * or accidentally panning when you intend to be typing/highlighting text in the textboxes.
      */
     onPointerDown = (e: React.PointerEvent) => {
        e.stopPropagation();
        /*Necessary to stop propagation, otherwise the freeform canvas could interpret
         * the click as an attempt to pan, and would consider the pointer to be down.*/
      }

  
  render() {
    return (
      <div className="modal-backdrop">
        <div className="modal-content" onPointerDown = {this.onPointerDown}>
          <h3>Add a new {StoreType[this.props.nodeType]} Node</h3>
          <form onSubmit={this.handleSubmit}>
            {this.fieldDefs.map((fd) => (
              <div key={fd.name} className="form-row">
                <label>{fd.label}</label>
                {this.renderInputFor(fd)}
              </div>
            ))}

            <div className="button-row">
              <button type="submit">Create</button>
              <button type="button" onClick={this.props.onCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
