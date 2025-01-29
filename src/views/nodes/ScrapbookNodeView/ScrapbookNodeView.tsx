// File: ScrapbookNodeView.tsx
import { observer } from "mobx-react";
import * as React from "react";
import { ScrapbookNodeStore } from "../../../stores/ScrapbookNodeStore";
import { BaseNodeFrame } from "../BaseNodeFrame/BaseNodeFrame";
import { BaseNodeProps } from "../BaseNodeFrame/BaseNodeProps";
import { NodeRenderer } from "../../NodeRenderer/NodeRenderer";
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
              ? <NodeRenderer store = {websiteChild} isContentOnly = {true}/>
              : <div className="placeholder">Drag Website to top bar to add</div> //drop a website here
            }
          </div>

          <div className="scrapbook-video-slot">
            {videoChild
              ? <NodeRenderer store = {videoChild} isContentOnly = {true}/>
              : <div className="placeholder">Drag Video to top bar to add</div> //drop a video here
            }
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { 
      store, 
      collection, 
      onFollowLink, 
      onDrag, 
      onDragEnd, 
      onDragStart,
      isContentOnly
    } = this.props;
    if(isContentOnly){
      return this.renderContent();
    }
    else{
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
}
