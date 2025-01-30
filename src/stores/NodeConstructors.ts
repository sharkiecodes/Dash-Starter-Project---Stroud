// NodeConstructors.ts
import { StoreType } from "./NodeStore";
import { NodeStore } from "./NodeStore";
import { StaticTextNodeStore } from "./StaticTextNodeStore";
import { VideoNodeStore, ImageNodeStore,WebsiteNodeStore,RichTextNodeStore,NodeCollectionStore,ScrapbookNodeStore, CompositeNodeStore } from "../stores";

/**Maps enum types to node stores */
export const NodeConstructors: Record<StoreType, typeof NodeStore> = {
  [StoreType.Text]: StaticTextNodeStore,
  [StoreType.Video]: VideoNodeStore,
  [StoreType.Image]: ImageNodeStore,
  [StoreType.Website]: WebsiteNodeStore,
  [StoreType.RichText]: RichTextNodeStore,
  [StoreType.Collection]: NodeCollectionStore,
  [StoreType.Scrapbook]: ScrapbookNodeStore,
  [StoreType.Composite] : CompositeNodeStore
};