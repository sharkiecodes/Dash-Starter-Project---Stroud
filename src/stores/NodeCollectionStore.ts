import { computed, observable, action } from "mobx";
import { NodeStore } from "./NodeStore";
import { FormField } from "./FormFieldDecorator";

/**An enumerated type that has layout options for a nested collection */
export enum LayoutMode {
    Freeform = "freeform", //standard, default view
    Grid = "grid", //Grid view
    Tree = "tree" //Hierarchical file view
  }

/**Represents a collection of nodes (NodeStores) */  
export class NodeCollectionStore extends NodeStore {

    constructor(initializer?: Partial<NodeCollectionStore>) {
        super();
        Object.assign(this, initializer);
    }

    @observable
    public layoutMode: LayoutMode = LayoutMode.Freeform; // default to Freeform

    @observable
    public panX: number = 0; //The panning of the collection horizontally

    @observable
    public panY: number = 0; //The panning of the collection vertically
    
    @observable
    @FormField ({ label: "Title", inputType: "string", defaultValue: "New Collection Node"})
    public title: string | undefined;

    @observable
    public nodes: NodeStore[] = new Array<NodeStore>();

    @computed
    public get transform(): string {
        return "translate(" + this.x + "px," + this.y + "px)"; // for CSS trnsform property
    }

    @action
    public addNodes(stores: NodeStore[]): void {
        this.nodes.push(...stores); // This is equivalent to: stores.forEach(store => this.nodes.push(store));

    }

    //convenience method
    /**Adds a node to the collection of nodes
     * @param store: the NodeStore to be added
     */
    @action
    public addNode(store: NodeStore): void {
        this.nodes.push(store);
    }

    /** 
     * Removes a node and bidirectionally removes all links to that node
     * @param store: the node you want to remove
    */
    @action
    public removeNode(store: NodeStore): void {
        // 1) Unlink from all connected nodes
    while (store.links.length > 0) {
        // Always remove the first one, until there are none left
        store.unlink(store.links[0]);
    }

    // 2) Remove from this collection’s nodes array
    const idx = this.nodes.indexOf(store);
    if (idx >= 0) {
        this.nodes.splice(idx, 1);
    }}

     /** 
     * Clears all nodes
    */
    @action
    public clearNodes(): void {
        this.nodes.forEach((n) => {
            // remove all cross-links
            n.links.forEach((linked) => {
                linked.unlink(n);
            });
        });
        this.nodes = [];
    }

     /**
     * Centers the canvas on a specific child node
     * @param node - the node to be centered on
     */
     @action
     public centerOn(node: NodeStore) {
         // the store already tracks a width/height of the container, so:
         const containerWidth = this.width;
         const containerHeight = this.height;
 
         const centerX = containerWidth / 2;
         const centerY = containerHeight / 2;
 
         // Pan offsets so that node center is in the center of the canvas
         this.panX = centerX - (node.x + node.width / 2);
         this.panY = centerY - (node.y + node.height / 2);
     }
    
}