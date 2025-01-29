// NodeConstructors.ts
import { StoreType } from "./NodeStore";
import { NodeStore } from "./NodeStore";
import { StaticTextNodeStore } from "./StaticTextNodeStore";
import { VideoNodeStore } from "./VideoNodeStore";
import { ImageNodeStore } from "./ImageNodeStore";
import { WebsiteNodeStore } from "./WebsiteNodeStore";
import { RichTextNodeStore } from "./RichTextNodeStore";
import { NodeCollectionStore } from "./NodeCollectionStore";
import { ScrapbookNodeStore } from "./ScrapbookNodeStore";
import { CompositeNodeStore } from "./CompositeNodeStore";
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

//changed the initializer to initializer? so that it can be null (which matches up with nodestore)