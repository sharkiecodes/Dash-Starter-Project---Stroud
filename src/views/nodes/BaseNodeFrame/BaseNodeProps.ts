import { NodeCollectionStore, NodeStore } from "../../../stores";

/**
 * A standard interface for props passed to a NodeView (the React component
 * that renders a single NodeStore).
 *
 * @template T - The specific NodeStore subclass (e.g., StaticTextNodeStore, ImageNodeStore).
 *               Defaults to the base NodeStore if not provided.
 */
export interface BaseNodeProps<T extends NodeStore = NodeStore> {
  /**
   * The underlying MobX store for this node.
   * Contains all the node’s observable data (x, y, width, height, etc.).
   */
  store: T;

  /**
   * A callback for removing this node from its parent. For my purposes, typically means
   * calling 'parentCollection.removeNode(store)'
   */
  onRemove: () => void;

  /**
   * Add a reference to the parent collection so we can show a link dropdown.
   * That is, if the node is part of a NodeCollectionStore, pass it here so we can
   * do things like linking (`LinkPanel`), or nested rendering. This is optional,
   * because not all contexts require a parent collection.
   */
  collection?: NodeCollectionStore;

  /**
   * An optional callback that lets a user “follow” a link to another node.
   * For example, a link panel may call `onFollowLink(linkedNode)`, and the
   * parent can then define the onFollowLink behavior (which I have implemented to be
   * centering on that node.
   */
  onFollowLink?: (node: NodeStore) => void;

  /**
   * Called when the user first starts dragging this node (e.g., clicking the
   * top bar). The parent might store a reference to the dragged node or reset
   * internal states.
   *
   * @param node - The NodeStore being dragged.
   * @param e    - The PointerEvent for this action.
   */
  onDragStart?: (node: NodeStore, e: PointerEvent) => void;

  /**
   * Called on every pointer move while dragging. Allows the parent to update
   * the node’s position (x, y) or do collision checks.
   *
   * @param node   - The NodeStore being dragged.
   * @param deltaX - Movement in the x direction since the last pointer event.
   * @param deltaY - Movement in the y direction since the last pointer event.
   * @param e      - The PointerEvent for this action.
   */
  onDrag?: (node: NodeStore, deltaX: number, deltaY: number, e: PointerEvent) => void;

  /**
   * Called when the user finishes dragging and releases the pointer.
   * Useful for finalizing position or merging with another node if they intersect.
   *
   * @param node - The NodeStore that was being dragged.
   * @param e    - The native PointerEvent for this action.
   */
  onDragEnd?: (node: NodeStore, e: PointerEvent) => void;
}
