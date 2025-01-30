// File: ScrapbookNodeStore.ts
import { CompositeNodeStore } from "./CompositeNodeStore";
import { StoreType, NodeStore } from "./NodeStore";
import { action } from "mobx";

/**
 * Specialized “Scrapbook” node type that:
*Extends the idea of a CompositeNode (a single frame that displays multiple child nodes).
* Pre-specifies one or more child “slots” such as exactly one website, exactly one video).
* Applies a custom layout/format inside that node.
* 
* 
 * A specialized CompositeNode that acts like a “Scrapbook”.
 * By default, it has one website slot and one video slot.
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
   * "enforce single video" logic here.
   */
  @action
  addChild(store: NodeStore) {
    // Since the template only wants exactly one website node 
    // remove any old website child, and replace with a second one
    if (store.type === StoreType.Website) {
      const existing = this.childNodes.find((n) => n.type === StoreType.Website);
      if (existing) {
        // replace the old one
        this.removeChild(existing);
      }
    }

    super.addChild(store); //adds a child as defined in CompositeNode
  }
}
