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
} from "../../../stores";

// Import only the *content-only* components, not the "framed" ones:
import {
  TextNodeContent,
  VideoNodeContent,
  ImageNodeContent,
  WebsiteNodeContent,
  RichTextNodeContent,
  CollectionNodeContent,
} from "..";

/**
 * A single function to return the "raw content" (no frame)
 * for any node type. This ensures we only maintain one switch,
 * used by NodeRenderer (when mode=ContentOnly) and by
 * CompositeNodeView if it wants to show child content directly.
 */
export function renderNodeContentOnly(node: NodeStore): JSX.Element {
  switch (node.type) {
    case StoreType.Text:
      return <TextNodeContent store={node as StaticTextNodeStore} />;
    case StoreType.Video:
      return <VideoNodeContent store={node as VideoNodeStore} />;
    case StoreType.Image:
      return <ImageNodeContent store={node as ImageNodeStore} />;
    case StoreType.Website:
      return <WebsiteNodeContent store={node as WebsiteNodeStore} />;
    case StoreType.RichText:
      return <RichTextNodeContent store={node as RichTextNodeStore} />;
    case StoreType.Collection:
      return <CollectionNodeContent store={node as NodeCollectionStore} />;
    case StoreType.Composite:
      return <></>;
    default:
      return <div>Unsupported node type {node.type}</div>;
  }
}
