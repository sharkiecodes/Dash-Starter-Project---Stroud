import { observer } from "mobx-react";
import * as React from 'react';
import { WebsiteNodeStore } from "../../../stores";
import "./../NodeView.scss";
import "./WebsiteNodeView.scss";
import { BaseNodeProps } from "../BaseNodeFrame/BaseNodeProps";
import { BaseNodeFrame } from "../BaseNodeFrame/BaseNodeFrame";

interface WebsiteNodeProps extends BaseNodeProps<WebsiteNodeStore>{}

interface WebsiteNodeContentProps{
    store: WebsiteNodeStore
}

@observer
export class WebsiteNodeContent extends React.Component<WebsiteNodeContentProps>{
    public render(){
        const store = this.props.store;
        return(
            <>
          {/* A title for  embedded website */}
          <h3 className="title">{store.title}</h3>

          {/* The iframe for the website URL */}
          <iframe className = "iframe" title = {store.title}
              src={store.websiteURL}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"/>
              {/**allowing certain attributes*/}
              </>
        )
    }
}

@observer
export class WebsiteNodeView extends React.Component<WebsiteNodeProps> {

    render() {
        //destructures this.props
        // fetches props for easy reference later on
        const { store, onRemove, collection, onFollowLink, onDrag, onDragEnd, onDragStart} = this.props;

        return (
    
            <div
                className="node websiteNode"  id={`node-${store.Id}`} 
                style={{
                    transform: store.transform,
                    width: store.width + "px",        // set width
                    height: store.height + "px", 
                    position: "absolute" // So that it doesn't push other components around
                }}
            >
               
                <BaseNodeFrame store = {store} onRemove = {onRemove} collection = {collection} onFollowLink = {onFollowLink} onDrag = {onDrag} onDragEnd = {onDragEnd} onDragStart ={onDragStart}>
                    <WebsiteNodeContent store = {store}/>
                </BaseNodeFrame>
            </div>
        );
    }
}


/**LIMITATIONS of iFrame
 * 
 * The iframe can only support websites that allow embedding. Many popular websites
 * do not support embedding.
 * 
 * Inputting either an invalid url or a url of an un-embeddable website leads to a blank node.
 * 
 * Also, clicking a link within an embedded site will only take you to the linked site if the linked
 * site also supports iframe embedding. For example, https://www.example.com can be embedded. However,
 * it links to iana.com, which cannot be embedded in iframes. therefore, clicking the link on
 * example.com will bring you to a blank screen.
 * 
 * Also, embedded links that are set to open in a new window will open in a new window in the actual browser.
 * iFrames do not store/recognize multiple "tabs"
 */