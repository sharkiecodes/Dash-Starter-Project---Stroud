import { computed, observable, action } from "mobx";
import { Utils } from "../Utils";
import { DEFAULT_NODE_HEIGHT, DEFAULT_NODE_WIDTH } from "../Constants";
import { FieldDefinition } from "./FieldDefinition";

/**
 * Enumerates the different types of nodes supported.
 * Note that `Collection` represents a nested NodeCollectionStore.
 */
export enum StoreType {
    Text,
    Video,
    Image,
    Website,
    RichText,
    Collection,
    Composite, //new! This node is a composite node created by SHIFT-clicking
    Scrapbook //new! This node has different templates and is an extension of a composite node
}

/**
 * The base class for any "node" in the system. Contains
 * common properties (x, y, width, height, etc.) and link logic.
 */
export class NodeStore {

    constructor(initializer?: Partial<NodeStore>) {
        Object.assign(this, initializer);
    }

      /*
    * Each NodeStore subclass can expose a static `fieldDefinitions` array.
    * That array describes which fields to prompt the user for
    * when creating or editing that NodeStore. 
    * 
    * Currently, this array provides field information for fields that are universal to all subclasses of NodeStore.
    * At this time, there is no universal field.
    * However, if desired, this can be edited to include
    * something such as the title field--meaning every node would have a title.
    * 
    * Each subclass of NodeStore can extend the array to add their own specific field information.*/    

    /**
   * Common field definitions shared by all nodes.
   * Subclasses will extend this array with specialized fields.
   * The decorator will push entries into this array. */
     public static fieldDefinitions: FieldDefinition[] = [];

    /** A unique identifier for this node. */
    public Id: string = Utils.GenerateGuid();

    /** The node's type, as defined in StoreType. */
    public type: StoreType | null = null;

    @observable
    public x: number = 0;

    @observable
    public title : string | undefined = ""

    @observable
    public y: number = 0;

    @observable
    public width: number = DEFAULT_NODE_WIDTH;

    @observable
    public height: number = DEFAULT_NODE_HEIGHT;

    /**
     * A list of other nodes that this node is linked to. Because linking is
     * bi-directional, if `A` links to `B`, then `B` should also link to `A`.
     */
    @observable
    public links: NodeStore[] = [];

    /**
     * Creates a two-way link between this node and the `other` node.
     * @param other - The node to link to.
     */
    @action
    public linkTo(other: NodeStore): void {
        // Avoid duplication
        if (!this.links.includes(other)) {
            this.links.push(other);
        }
        // Also add 'this' to the other side
        if (!other.links.includes(this)) {
            other.links.push(this);
        }
    }

    /**
     * Removes an existing two-way link between this node and the `other` node.
     * @param other - The node to unlink.
     */
    @action
    public unlink(other: NodeStore): void {
        // Remove from this node's links
        const idx = this.links.indexOf(other);
        if (idx >= 0) {     
            this.links.splice(idx, 1);
        }
       
        // Remove from the other node's links
        const otherIdx = other.links.indexOf(this);
        if (otherIdx >= 0) {
            other.links.splice(otherIdx, 1);
        }
    }

    /**
     * A computed property for applying a CSS transform (translate)
     * to position this node.
     */
    
    @computed
    public get transform(): string {
        return "translate(" + this.x + "px, " + this.y + "px)";
    }
}
/***Note--Further elaboration on field definitions implementation***
*Conceptually, in practice the field definitions would be used as follows:
* 
* For the selected NodeClass:
*  const fieldDefs = NodeClass.fieldDefinitions;
*  fieldDefs.forEach(...); // build inputs */
