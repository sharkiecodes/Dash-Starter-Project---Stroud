// File: ScrapbookNodeView.tsx
import { observer } from "mobx-react";
import * as React from "react";
import { ScrapbookNodeStore } from "../../../stores/ScrapbookNodeStore";
import { BaseNodeFrame } from "../BaseNodeFrame/BaseNodeFrame";
import { BaseNodeProps } from "../BaseNodeFrame/BaseNodeProps";
import { renderNodeContentOnly } from "../NodeContentRenderer/NodeContentRenderer";
import "./ScrapbookNodeView.scss";

@observer
export class ScrapbookNodeView extends React.Component<BaseNodeProps<ScrapbookNodeStore>> {

  renderContent = () => {
    const { store } = this.props;

    // For example, find exactly one Website, one Video, ignoring others:
    const websiteChild = store.childNodes.find((n) => n.type === 3 /* StoreType.Website */);
    const videoChild   = store.childNodes.find((n) => n.type === 1 /* StoreType.Video */);

    return (
      <div className="scrapbook-content">
        {/* Title, or any extra text */}
        <h3>{store.title}</h3>

        <div className="scrapbook-layout">
          <div className="scrapbook-website-slot">
            {websiteChild 
              ? renderNodeContentOnly(websiteChild)
              : <div className="placeholder">Drop a Website here</div>
            }
          </div>

          <div className="scrapbook-video-slot">
            {videoChild
              ? renderNodeContentOnly(videoChild)
              : <div className="placeholder">Drop a Video here</div>
            }
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { 
      store, 
      onRemove, 
      collection, 
      onFollowLink, 
      onDrag, 
      onDragEnd, 
      onDragStart 
    } = this.props;

    return (
      <div
        className="node scrapbookNode"
        id={`node-${store.Id}`}
        style={{
          transform: store.transform,
          width: store.width + "px",
          height: store.height + "px",
          position: "absolute",
        }}
      >
        <BaseNodeFrame
          store={store}
          onRemove={onRemove}
          collection={collection}
          onFollowLink={onFollowLink}
          onDrag={onDrag}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          {this.renderContent()}
        </BaseNodeFrame>
      </div>
    );
  }
}
