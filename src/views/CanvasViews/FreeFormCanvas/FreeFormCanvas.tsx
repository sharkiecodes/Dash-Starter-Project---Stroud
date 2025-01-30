import { observer } from "mobx-react";
import { observable } from "mobx";
import * as React from "react";
import {
  NodeCollectionStore,
  NodeStore,
  StoreType,
  CompositeNodeStore,
  ScrapbookNodeStore,
  MouseTrailStore
} from "../../../stores";

import { NodeRenderer } from "../../NodeRenderer/NodeRenderer";
import { LinkOverlay } from "../../LinkOverlay/LinkOverlay"; // <-- arrows overlay
import { MouseTrailView } from "../../MouseTrail/MouseTrailView";
import { TOPBAR_HEIGHT } from "../../../Constants";
import "./FreeFormCanvas.scss";

interface FreeFormProps {
  store: NodeCollectionStore;          // The node-collection store for this freeform canvas
  mouseTrailStore?: MouseTrailStore;   // <-- optional prop for the MouseTrailStore
}

/**
 * The FreeFormCanvas class renders a collection of child nodes in standard frames on a canvas
 * that can be panned by dragging. The class manages drag-and-drop behavior for nodes and
 * general handling of user dragging/panning on the canvas.
 * Also manages the canvas's response to following links (centering on a node)
 * Additionally displays a LinkOverlay, which are arrows connecting linked nodes.
 * Optionally includes a mouse trail that triggers when panned.
 */
@observer
export class FreeFormCanvas extends React.Component<FreeFormProps> {
  private isPointerDown = false; //tracks pointer

   /*
   * References to the node we are actively dragging and the node being hovered as a drop target.
   */
  private draggingNode: NodeStore | null = null;

  
  /*Represents the target node for dragging-and-dropping*/
  @observable
  private dropTargetNode: NodeStore | null = null;   



   /*
   * Store a ref to the outer container so we can measure
   * its width/height for centering a node. (For following links)
   */
   private containerRef = React.createRef<HTMLDivElement>();


  /**This method evaluates if two dragged nodes are intersecting based on whether
   * or not their top bars are intersecting.
   * Takes in two parameters which represent the NodeStores being dragged.
   * @param a a NodeStore being dragged
   * @param b the second NodeStore being dragged 
   * @returns a boolean representing whether the nodes are intersecting
   * (Order of which node is passed as "a" or "b" is irrelevant)
   */
  private boxesIntersectTopBars = (a: NodeStore, b: NodeStore) => {
    // Instead of checking the entire node's bounding box ...
    // node.x, node.y, node.width, node.height
    // check only the top bar region:

    // A's top bar is at (a.x, a.y, a.width, TOPBAR_HEIGHT)
    const ax = a.x;
    const ay = a.y;
    const aw = a.width;
    const ah = TOPBAR_HEIGHT;

    // B's top bar is at (b.x, b.y, b.width, TOPBAR_HEIGHT)
    const bx = b.x;
    const by = b.y;
    const bw = b.width;
    const bh = TOPBAR_HEIGHT;

    return (
      ax < bx + bw &&
      ax + aw > bx &&
      ay < by + bh &&
      ay + ah > by
    );
  }
  

  /** 
   * Helper method for arranging nodes in a staggered grid view.
   * 
   * Loose Pseudocode: 
   * First, get current width and height of the collection canvas container. 
   * Divide the total height of the container by the number of nodes => newNodeHeight. 10% of newNodeHeight = padding. 
   * Repeat for width. For i = 0, i < nodes.length, i++ { new width = 0.9 newNodeWidth; 
   * new height = 0.9*newNodeHeight; new X (pre-pan) = newNodeWidth*i, new Y (pre-pan) = newNodeHeight*Y 
   * Set Y differently for every other node to stagger.
   */

  private arrangeInGrid = () => {
    const { store } = this.props;
    const containerElem = this.containerRef.current;
    if (!containerElem) { 
      return; //Can't continue if there is no bounding client to measure from
    }

    // 1) Measure container width/height
    const rect = containerElem.getBoundingClientRect();
    const containerWidth = rect.width;
    const containerHeight = rect.height;

    const nodeCount = store.nodes.length;
    if (nodeCount === 0) return; //No nodes to arrange, so return immediately

    // For a single row, each node gets containerWidth / nodeCount space (minus padding).
    const newNodeWidth =  containerWidth / nodeCount;
    const newNodeHeight = containerHeight / 2; 
    // Alternative implementation for a column-based arrangement could be:
    // const newNodeHeight = containerHeight / nodeCount;

    //  Each node is 90% of that computed width/height, 
    // with the other 10% effectively acting like “padding”.
    for (let i = 0; i < nodeCount; i++) {
      const node: NodeStore = store.nodes[i];
      
      // incorporate store.panX later for camera offset
      const x = newNodeWidth * i;
      const y = 0 // For a single row, we keep y=0; alternatively could try newNodeHeight * i for different results

      /* Now do the sizing. We’ll use 90% of the computed dimension.
      *To get the grid view to work, all nodes should be resized to a single new node size
       */
      const w = 0.9 * newNodeWidth;
      const h = 0.9 * newNodeHeight;

      // Update the node store’s position and size
      
      node.x = x - store.panX; // or just x, depends if you want them lined up with your current pan
      node.width = w;
      node.height = h;
      /*To achieve a staggered effect, adjust the y-value differently
      for every other node...*/
        if (i%2 == 0){
          // The x-position is already i * newNodeWidth.
        const y = newNodeHeight
        //Update the node store’s position and size
        node.y = y - store.panY;
      }
      else{
        node.y = y - store.panY;
      }
    }
    
  };

  /**
   * Centers on a particular node.
   * Adjusts the panning of the canvas appropriately to be centered on the given node.
   * @param node the NodeStore to be centered on
   * 
   */
  centerOnNode = (node: NodeStore) => {
    const containerEl = this.containerRef.current;
    if (!containerEl) return;

    // 1) Get the container size (visible area).
    const rect = containerEl.getBoundingClientRect();
    // e.g. rect.width, rect.height, etc.

    // 2) The center of the container in *screen* coords
    const containerCenterX = rect.width / 2;
    const containerCenterY = rect.height / 2;

    // 3) The node's center in *world* coords (prior to panning).
    // Because the node has x, y for top-left, add half its width/height:
    const nodeCenterX = node.x + node.width / 2;
    const nodeCenterY = node.y + node.height / 2;

    // 4) We want the node's center to align with the container's center.
    // If nodeCenterX is at world coordinate 500, and containerCenterX is 400,
    // we want to shift the entire canvas by (400 - 500) = -100 => panX = -100
    // so that 500 moves to 400. 
    // But note we *add* to store.panX if the container was already offset.
    // Actually, we want store.panX = containerCenterX - nodeCenterX
    // so that the node is moved to containerCenterX.
    
    this.props.store.panX = containerCenterX - nodeCenterX;
    this.props.store.panY = containerCenterY - nodeCenterY;
  };

   /**
    * Handles following link behavior
    * @param node the linked NodeStore you are trying to follow 
    */
    handleFollowLink = (node: NodeStore) => {
      this.centerOnNode(node);  //callback for "Follow" actions from the LinkPanel in node views
    };

   // ---------------------------
  // DRAGGING A NODE:  Called by child node’s TopBar
  // ---------------------------
  /**
   * Callback referred to by the topbar
   * for handling the beginning of a node drag movement
   * @param node the node being dragged
   */
  handleNodeDragStart = (node: NodeStore) => {
    this.draggingNode = node;
    // Clear any old drop target
    this.dropTargetNode = null;
  };

  /**
   * Handles the dragging and identifies if a node is dragged over another
   * If two nodes' topbars collide, record this logically.
   * @param node the node being dragged
   * @param deltaX offset in node x direction
   * @param deltaY offset in node y direction
   */
  handleNodeDrag = (node: NodeStore, deltaX: number, deltaY: number) => {
    // Actually move the node
    node.x += deltaX;
    node.y += deltaY;

    // If the layout is not freeform, skip collision detection
    if (this.props.store.layoutMode !== "freeform") return;

    // Check if we are overlapping any other node
    let foundTarget: NodeStore | null = null;
    for (const other of this.props.store.nodes) {
      // Skip self
      if (other === node) continue;

      // If they overlap, mark as found target and break
      if (this.boxesIntersectTopBars(node, other)) {
        foundTarget = other;
        break;
      }
    }
    // Update the local “drop target” reference
    this.dropTargetNode = foundTarget;
  };

  /**Handles the end of a node drag sequence.
   * @param node the node being dragged
   * @param e the PointerEvent, used to detect if shift key is pressed
   */
  handleNodeDragEnd = (node: NodeStore, e: PointerEvent) => {
    // If we have a dropTargetNode, do the merge
    if (this.dropTargetNode) {
            // Check SHIFT
      const shiftPressed = e.shiftKey;
      this.mergeNodes(node, this.dropTargetNode, shiftPressed);

    }
    // Reset
    this.draggingNode = null;
    this.dropTargetNode = null;
  };

 /**
 *  Merge two nodes when one is dragged onto the other.
 * Depending on the node types, different merge strategies are applied.
 * * - If the drop target is already a CollectionNode, we add the dragged node as a child.
 * - If the dragged node is a CollectionNode (but the target is not), we add the target as a child.
 * - Otherwise, we create a new CollectionNode to contain them both.
 * @param dragged - The node that was being dragged.
 * @param target - The node on which the dragged node was dropped.
 * @param useComposite - If true, we create a CompositeNodeStore as the container.
 */
private mergeNodes(dragged: NodeStore, target: NodeStore, useComposite: boolean): void {
  const parentCollection = this.props.store;

  // 1) If we explicitly want to create a CompositeNodeStore to hold both nodes:
  if (useComposite) {
    this.mergeIntoComposite(dragged, target, parentCollection);
    return;
  }

  // 2) If the target is a Scrapbook node, just add the dragged node inside it.
  if (target.type === StoreType.Scrapbook) {
    this.addToScrapbook(dragged, target as ScrapbookNodeStore, parentCollection);
    return;
  }

  // 3) If the target is already a Collection, add the dragged node to that collection.
  if (target.type === StoreType.Collection) {
    this.addNodeToCollection(dragged, target as NodeCollectionStore, parentCollection);
    return;
  }

  // 4) If the dragged node is a Collection (but target is not), add the target to the dragged collection.
  if (dragged.type === StoreType.Collection) {
    this.addTargetToDraggedCollection(dragged as NodeCollectionStore, target, parentCollection);
    return;
  }

  // 5) Otherwise, neither is a collection. Create a new Collection node to wrap both.
  this.wrapNodesInNewCollection(dragged, target, parentCollection);
}

/**
 * Merges both the dragged and the target nodes into a newly created CompositeNodeStore.
 * @param dragged - The node that was being dragged.
 * @param target - The node on which the dragged node was dropped.
 * @param parentCollection - The parent collection from which both nodes are being removed.
 */
private mergeIntoComposite(
  dragged: NodeStore,
  target: NodeStore,
  parentCollection: NodeCollectionStore
) {
  // 1) Create a new composite node and set its position and size
  const composite = new CompositeNodeStore({
    type: StoreType.Composite,
    title: "", // Or give it a name like "Composite Node"
    childNodes: [dragged, target],
    x: target.x,
    y: target.y,
    width: Math.max(dragged.width, target.width),
    height: Math.max(dragged.height, target.height),
  });

  // 2) Remove the dragged and target nodes from the parent
  parentCollection.removeNode(dragged);
  parentCollection.removeNode(target);

  // 3) Adjust each child's coordinates so they remain visually in the same place,
  //   but relative to the new CompositeNode's origin
  dragged.x -= composite.x;
  dragged.y -= composite.y;
  target.x -= composite.x;
  target.y -= composite.y;

  // 4) Finally, add the composite to the parent
  parentCollection.addNode(composite);
}

/**
 * Adds the dragged node into an existing Scrapbook node.
 * @param dragged - The node that was being dragged.
 * @param scrapbook - The target scrapbook node to which the dragged node will be added.
 * @param parentCollection - The parent collection that currently holds the dragged node.
 */
private addToScrapbook(
  dragged: NodeStore,
  scrapbook: ScrapbookNodeStore,
  parentCollection: NodeCollectionStore
) {
  // 1) Remove the dragged node from its current parent
  parentCollection.removeNode(dragged);

  // 2) Add it to the scrapbook’s list of child nodes
  scrapbook.addChild(dragged);
}

/**
 * Adds the dragged node to an existing collection node.
 * @param dragged - The node that was being dragged.
 * @param targetCollection - The existing collection node that will hold the dragged node.
 * @param parentCollection - The parent collection that currently holds the dragged node.
 */
private addNodeToCollection(
  dragged: NodeStore,
  targetCollection: NodeCollectionStore,
  parentCollection: NodeCollectionStore
) {
  // 1) Remove the dragged node from the top-level collection
  parentCollection.removeNode(dragged);

  // 2) Adjust the node’s coordinates so it appears in the correct position
  //    relative to the targetCollection’s internal coordinate system
  dragged.x -= targetCollection.x;
  dragged.y -= targetCollection.y;

  // 3) Add the dragged node to the target collection
  targetCollection.addNode(dragged);
}

/**
 * If the dragged node is a collection, add the single target node inside it.
 * @param draggedCollection - The dragged node, cast as a NodeCollectionStore.
 * @param target - The node onto which it was dropped (not a collection).
 * @param parentCollection - The parent collection that holds the target node.
 */
private addTargetToDraggedCollection(
  draggedCollection: NodeCollectionStore,
  target: NodeStore,
  parentCollection: NodeCollectionStore
) {
  // 1) Remove the target node from its original parent
  parentCollection.removeNode(target);

  // 2) Adjust its position so it remains visually consistent
  target.x -= draggedCollection.x;
  target.y -= draggedCollection.y;

  // 3) Add the target inside the dragged collection
  draggedCollection.addNode(target);
}

/**
 * Wraps both dragged and target nodes in a newly created collection.
 * @param dragged - The node that was being dragged.
 * @param target - The node on which the dragged node was dropped.
 * @param parentCollection - The parent collection that currently holds both nodes.
 */
private wrapNodesInNewCollection(
  dragged: NodeStore,
  target: NodeStore,
  parentCollection: NodeCollectionStore
) {
  // 1) Remove both nodes from the parent
  parentCollection.removeNode(dragged);
  parentCollection.removeNode(target);

  // 2) Create a new collection to contain them
  const newCollection = new NodeCollectionStore({
    type: StoreType.Collection,
    x: target.x,
    y: target.y,
    width: target.width,
    height: target.height,
    title: "Merged Collection (resize to view)",
  });

  // 3) Adjust each node’s position relative to the new collection’s origin
  dragged.x -= newCollection.x;
  dragged.y -= newCollection.y;
  target.x -= newCollection.x;
  target.y -= newCollection.y;

  // 4) Add both nodes into the new collection
  newCollection.addNode(target);
  newCollection.addNode(dragged);

  // 5) Finally, add this new collection to the parent collection
  parentCollection.addNode(newCollection);
}

  // ---------------------------
  // Mouse/Pointer Handlers
  // ---------------------------
  /**Manages pointer down situation
   * @param e the pointer event generated by the user clicking on the canvas
   */
  onPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    //removed e.preventDefault() to enable clicking add-node-options; i.e sometimes default behavior is desirable
    this.isPointerDown = true;
    document.removeEventListener("pointermove", this.onPointerMove);
    document.addEventListener("pointermove", this.onPointerMove);
    document.removeEventListener("pointerup", this.onPointerUp);
    document.addEventListener("pointerup", this.onPointerUp);
  };

  /**Manages pointer movement situation
   * Pans and adds point to mouse trail if the pointer is down (that is, we are dragging)
   * @param e the pointer event generated by the user clicking on the canvas
   */
  onPointerMove = (e: PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    

    if (!this.isPointerDown) return;
    this.props.store.panX += e.movementX
    this.props.store.panY += e.movementY //Now we only shift the internal "camera" offsets

      // 2) Also add a mouse-trail point (if we have a store)
      if (this.props.mouseTrailStore) {
        // For an accurate position, use the absolute clientX/clientY
        this.props.mouseTrailStore.addPoint(e.clientX, e.clientY);
  };

}
  /**
   * Manages onPointerUp behavior
   * @param e the PointerEvent generated by the user releasing the pointer
   */
  onPointerUp = (e: PointerEvent) => {
     e.stopPropagation();
    e.preventDefault();
    this.isPointerDown = false;
    document.removeEventListener("pointermove", this.onPointerMove);
    document.removeEventListener("pointerup", this.onPointerUp);
  };


  // ---------------------------
  // Render
  // ---------------------------
  render() {
    const { store, mouseTrailStore } = this.props;


    return (
      <div className="freeformcanvas-container" onPointerDown={this.onPointerDown} ref={this.containerRef}>
        {/* The "canvas" gets moved around by pointer events */}
        <div className="freeformcanvas" style={{ transform: `translate(${store.panX}px, ${store.panY}px)`}}>
          {store.nodes.map((nodeStore) => {
          const isDropTarget = (this.dropTargetNode === nodeStore);
          return (
            <div
              key={nodeStore.Id}
              className={
                "collection-child-wrapper" + (isDropTarget ? " hovered-drop-target" : "")
              }
            >
              <NodeRenderer
                store={nodeStore}
                isContentOnly = {false}
                collection={store}
                onFollowLink={this.handleFollowLink}
                onDrag = {this.handleNodeDrag}
                onDragStart = {this.handleNodeDragStart}
                onDragEnd = {this.handleNodeDragEnd}
              />
            </div>
          );
        }
    )
  }
        </div>
        <LinkOverlay collection={store} /> {/*Arrow overlay */}
        {/*
          Render mouse trails overlay on top of everything.
          This is an absolutely positioned layer covering the entire area.
        */}
        {mouseTrailStore && <MouseTrailView store={mouseTrailStore} />}
       
        {/* Button to trigger "grid-like" layout */}
        <div className="arrange-grid-ui">
          <button onClick={this.arrangeInGrid}>
            Arrange in Staggered Grid
          </button></div>
      </div>

      
    );
  }
}
