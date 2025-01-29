// NodeContentRenderer.ts
import {
  NodeStore,
  StoreType,
  StaticTextNodeStore,
  VideoNodeStore,
  ImageNodeStore,
  WebsiteNodeStore,
  RichTextNodeStore,
  NodeCollectionStore,
  CompositeNodeStore,
} from "../../../stores";

/**
 * A single function to return the "raw content" (no frame)
 * for any node type. This ensures we only maintain one switch,
 * used by NodeRenderer (when mode=ContentOnly) and by
 * CompositeNodeView if it wants to show child content directly.

      SCrapbook return <div>Unsupported node type {node.type}</div>;
      */

