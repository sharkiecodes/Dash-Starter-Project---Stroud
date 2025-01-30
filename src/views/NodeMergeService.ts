import { 
    NodeStore, 
    NodeCollectionStore, 
    CompositeNodeStore, 
    ScrapbookNodeStore, 
    StoreType 
  } from "../stores";
  
/*
 *  This class manages how to merge two nodes when one is dragged onto the other.
 * Depending on the node types, different merge strategies are applied.
 * * - If the drop target is already a CollectionNode, we add the dragged node as a child.
 * - If the dragged node is a CollectionNode (but the target is not), we add the target as a child.
 * - Otherwise, we create a new CollectionNode to contain them both.
 * 
 */
  export class NodeMergeService {
    /**
     * Merges two nodes when one is dragged onto the other.
     * Depending on the node types and `useComposite` flag,
     * it will delegate to specialized merge strategies.
     *
     * @param dragged - The node being dragged.
     * @param target - The node that the dragged node was dropped onto.
     * @param useComposite - If true, create a CompositeNodeStore to wrap both.
     * @param parentCollection - The parent collection containing the two nodes.
     */
   public static mergeNodes = (
     dragged: NodeStore,
     target: NodeStore,
     useComposite: boolean,
     parentCollection: NodeCollectionStore
   ) => {
     if (useComposite) {
       this.mergeIntoComposite(dragged, target, parentCollection);
       return;
     }
     
     if (target.type === StoreType.Scrapbook) {
       this.addToScrapbook(dragged, target as ScrapbookNodeStore, parentCollection);
       return;
     }
 
     if (target.type === StoreType.Collection) {
       this.addNodeToCollection(dragged, target as NodeCollectionStore, parentCollection);
       return;
     }
 
     if (dragged.type === StoreType.Collection) {
       this.addTargetToDraggedCollection(dragged as NodeCollectionStore, target, parentCollection);
       return;
     }
     
     // Default scenario if neither node is a collection:
     this.wrapNodesInNewCollection(dragged, target, parentCollection);
   }
 
   /**
    * Creates a new CompositeNodeStore and places both dragged and target inside it.
    * @param dragged - Node being dragged
    * @param target - Node onto which it was dropped
    * @param parentCollection - The parent collection for both nodes
    */
   private static mergeIntoComposite = (
     dragged: NodeStore,
     target: NodeStore,
     parentCollection: NodeCollectionStore
   ) => {
     // Create a new composite node and set its position/size
     const composite = new CompositeNodeStore({
       type: StoreType.Composite,
       title: "", //Looks better without a title
       childNodes: [dragged, target],
       x: target.x,
       y: target.y,
       width: Math.max(dragged.width, target.width),
       height: Math.max(dragged.height, target.height),
     });
 
     // Remove old nodes from parent
     parentCollection.removeNode(dragged);
     parentCollection.removeNode(target);
 
     // Reposition children relative to the new composite’s origin
     dragged.x -= composite.x;
     dragged.y -= composite.y;
     target.x -= composite.x;
     target.y -= composite.y;
 
     // Add the new composite to the parent
     parentCollection.addNode(composite);
   }
 
   /**
    * If the target is a ScrapbookNode, just add the dragged node inside it.
    * @param dragged - Node being dragged
    * @param scrapbook - Scrapbook node target
    * @param parentCollection - The parent collection that contains the dragged node
    */
   private static addToScrapbook = (
     dragged: NodeStore,
     scrapbook: ScrapbookNodeStore,
     parentCollection: NodeCollectionStore
   ) => {
     parentCollection.removeNode(dragged);
     scrapbook.addChild(dragged);
   }
 
   /**
    * If the target is already a Collection, add the dragged node to it.
    * @param dragged - Node being dragged
    * @param targetCollection - The collection node to which we'll add the dragged node
    * @param parentCollection - The top-level (parent) collection currently holding the dragged node
    */
   private static addNodeToCollection = (
     dragged: NodeStore,
     targetCollection: NodeCollectionStore,
     parentCollection: NodeCollectionStore
   ) => {
     parentCollection.removeNode(dragged);
     dragged.x -= targetCollection.x;
     dragged.y -= targetCollection.y;
     targetCollection.addNode(dragged);
   }
 
   /**
    * If the dragged node is a collection, add the single target node inside it.
    * @param draggedCollection - The collection node that is being dragged
    * @param target - The node that was dropped upon
    * @param parentCollection - The top-level (parent) collection currently holding the target node
    */
   private static addTargetToDraggedCollection = (
     draggedCollection: NodeCollectionStore,
     target: NodeStore,
     parentCollection: NodeCollectionStore
   ) => {
     parentCollection.removeNode(target);
     target.x -= draggedCollection.x;
     target.y -= draggedCollection.y;
     draggedCollection.addNode(target);
   }
 
   /**
    * If neither node is a collection, create a new collection to wrap them both.
    * @param dragged - Node being dragged
    * @param target - Node onto which it was dropped
    * @param parentCollection - The parent collection that currently holds both
    */
   private static wrapNodesInNewCollection = (
     dragged: NodeStore,
     target: NodeStore,
     parentCollection: NodeCollectionStore
   ) => {
     parentCollection.removeNode(dragged);
     parentCollection.removeNode(target);
 
     const newCollection = new NodeCollectionStore({
       type: StoreType.Collection,
       x: target.x,
       y: target.y,
       width: target.width,
       height: target.height,
       title: "Merged Collection",
     });
 
     dragged.x -= newCollection.x;
     dragged.y -= newCollection.y;
     target.x -= newCollection.x;
     target.y -= newCollection.y;
 
     newCollection.addNode(target);
     newCollection.addNode(dragged);
 
     parentCollection.addNode(newCollection);
   }
 }