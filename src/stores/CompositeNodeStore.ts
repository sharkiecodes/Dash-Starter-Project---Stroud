// CompositeNodeStore.ts
import { NodeStore } from "./NodeStore";
import { observable, action } from "mobx";

/**
 * A store representing a single node that displays 
 * multiple "child nodes" together in one composite layout.
 * Create a CompositeNodeStore by dragging two nodes together while holding SHIFT.
 */
export class CompositeNodeStore extends NodeStore {
    @observable
    public childNodes: NodeStore[] = []; //list of child nodes represented by the CompositeNode

    constructor(initializer?: Partial<CompositeNodeStore>) {
        super();
        Object.assign(this, initializer); //Assigns properties, if provided
    }
    @observable
    public title: string = ""; //Title of the composite node

    /**Adds a child to the list of child nodes.
     * @param store the NodeStore to be added
     */
    @action
    addChild(store: NodeStore) {
        this.childNodes.push(store); //Adds a child
    }

    /**Removes a child from list of childnodes, if it exists in the list.
     * @param store the child store you wish to remove
    */
    @action
    removeChild(store: NodeStore) {
        const idx = this.childNodes.indexOf(store);
            if (idx >= 0) {
                this.childNodes.splice(idx, 1);
            }
    }
}
/*Note: Because CompositeNodeStores can only be created through drag-and-drop, and not through
the add nodes UI, there is no need to use the FormFields decorator on this store's fields */