// File: ScrapbookNodeStore.ts
import { CompositeNodeStore } from "./CompositeNodeStore";
import { StoreType, NodeStore } from "./NodeStore";
import { action } from "mobx";

/**
 * Specialized “Scrapbook” node type that:
*Extends the idea of a CompositeNode (a single frame that displays multiple child nodes).
* Pre-specifies one or more child “slots” such as exactly one website, exactly one video).
* Applies a custom layout/format inside that node.
 * A specialized CompositeNode that acts like a “Scrapbook”.
 * By default, it has one website slot, one video slot, etc.
 */
export class ScrapbookNodeStore extends CompositeNodeStore {
  constructor(initializer?: Partial<ScrapbookNodeStore>) {
    super();
    Object.assign(this, initializer);
    this.type = StoreType.Scrapbook;
    if (!this.title) {
      this.title = "My Scrapbook";
    }
  }

  /** "enforce single website" or 
   * "enforce single video" logic here. For example:
   */
  @action
  addChild(store: NodeStore) {
    // If the template only wants exactly one website node, you could 
    // remove any old website child, or refuse to add a second one, etc.
    if (store.type === StoreType.Website) {
      const existing = this.childNodes.find((n) => n.type === StoreType.Website);
      if (existing) {
        // replace the old one
        this.removeChild(existing);
      }
    }
    // or do the same for videos, images, etc.

    super.addChild(store); //adds a child as defined in CompositeNode
  }
}
