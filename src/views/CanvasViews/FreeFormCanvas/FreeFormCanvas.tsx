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
import { AddNodeToolbar } from "../../AddNodeToolbar/AddNodeToolbar";
import "./FreeFormCanvas.scss";


interface FreeFormProps {
  store: NodeCollectionStore;          // The node-collection store for this freeform canvas
  mouseTrailStore?: MouseTrailStore;   // <-- optional prop for the MouseTrailStore
}

/**This method evaluates if two dragged nodes are intersecting based on whether
 * or not their top bars are intersecting.
 * Takes in two parameters which represent the NodeStores being dragged.
 */
function boxesIntersectTopBars(a: NodeStore, b: NodeStore): boolean {
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



   /**
   * Store a ref to the outer container so we can measure
   * its width/height for centering a node. (For following links)
   */
   private containerRef = React.createRef<HTMLDivElement>();

  

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


  // ----------------------------------
  // Center on a particular node
  // ----------------------------------
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

    //callback for "Follow" actions from the LinkPanel in node views
    handleFollowLink = (node: NodeStore) => {
      this.centerOnNode(node);
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
      if (boxesIntersectTopBars(node, other)) {
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
   * Merges two nodes into one:
   * - If the drop target is already a CollectionNode, we add the dragged node as a child.
   * - If the dragged node is a CollectionNode (but the target is not), we add the target as a child.
   * - Otherwise, we create a new CollectionNode to contain them both.
   */
  private mergeNodes(dragged: NodeStore, target: NodeStore, useComposite: boolean): void {
    const parentCollection = this.props.store;

    if (useComposite) {
      // Create a CompositeNode instead of a nested NodeCollection
      const composite = new CompositeNodeStore({
        // position, width, etc. 
        type: StoreType.Composite,
        title: "", //or "Composite Node", but I think it looks cleaner without a title
        childNodes: [dragged, target],
        x: target.x,
        y: target.y,
        width: Math.max(dragged.width, target.width),
        height: Math.max(dragged.height, target.height),
      });
  
      // remove from parent
      parentCollection.removeNode(dragged);
      parentCollection.removeNode(target);
  
      // offset child positions if you want
      dragged.x = dragged.x - composite.x;
      dragged.y = dragged.y - composite.y;
      target.x = target.x - composite.x;
      target.y = target.y - composite.y;
  
      // add the new composite to the parent
      parentCollection.addNode(composite);
      return;
    }
    else if (target.type === StoreType.Scrapbook) {
      // add the dragged node as a child of that Scrapbook
      parentCollection.removeNode(dragged);
      (target as ScrapbookNodeStore).addChild(dragged);
      // offset x/y if necessary
      return;
    }
    // CASE 1: If `target` is already a collection, just add `dragged`
    if (target.type === StoreType.Collection) {
      // parent removes dragged
      parentCollection.removeNode(dragged);

      // cast to NodeCollectionStore
      const targetCollection = target as NodeCollectionStore;

      // Adjust dragged’s coords to be inside that node, if you want
      // e.g. place them relative to the target’s top-left
      dragged.x = dragged.x - targetCollection.x;
      dragged.y = dragged.y - targetCollection.y;

      targetCollection.addNode(dragged);
      return;
    }

    // CASE 2: If `dragged` is a collection but `target` is not
    if (dragged.type === StoreType.Collection) {
      // remove `target` from parent
      parentCollection.removeNode(target);

      // cast dragged to NodeCollectionStore
      const draggedCollection = dragged as NodeCollectionStore;

      // adjust target’s coords to place it inside dragged
      target.x = target.x - draggedCollection.x;
      target.y = target.y - draggedCollection.y;

      draggedCollection.addNode(target);
      return;
    }

    // CASE 3: Otherwise, neither is a collection. We create a new one.
    //  a) remove both from the parent
    parentCollection.removeNode(dragged);
    parentCollection.removeNode(target);

    //  b) create a new NodeCollectionStore
    const newCollection = new NodeCollectionStore({
      // Give it a size, position, etc. 
      type: StoreType.Collection,
      x: target.x,
      y: target.y,
      width: target.width,
      height: target.height,
      title: "Merged Collection (resize to view)"
    });

    // c) Add both nodes inside that collection
    // We’ll adjust them to sit inside the new Collection
    dragged.x = dragged.x - newCollection.x;
    dragged.y = dragged.y - newCollection.y;

    target.x = target.x - newCollection.x;
    target.y = target.y - newCollection.y;

    newCollection.addNode(target);
    newCollection.addNode(dragged);

    // d) Add the new collection to the parent
    parentCollection.addNode(newCollection);
  }

  // ---------------------------
  // Mouse/Pointer Handlers
  // ---------------------------
  onPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation(); //removed for nested?!?!
    //e.preventDefault(); //removed to enable clicking add-node-options
    this.isPointerDown = true;
    document.removeEventListener("pointermove", this.onPointerMove);
    document.addEventListener("pointermove", this.onPointerMove);
    document.removeEventListener("pointerup", this.onPointerUp);
    document.addEventListener("pointerup", this.onPointerUp);
  };

  
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

  onPointerUp = (e: PointerEvent) => {
     e.stopPropagation();
    e.preventDefault(); //removed ?
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
