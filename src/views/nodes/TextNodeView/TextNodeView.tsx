import { observer } from "mobx-react";
import * as React from 'react';
import { StaticTextNodeStore } from "../../../stores";
import "./../NodeView.scss"; //SCSS Styling sheets
import "./TextNodeView.scss";
import { BaseNodeFrame } from "../BaseNodeFrame/BaseNodeFrame"; //BaseNodeFrame for viewing a node
import { BaseNodeProps } from "../BaseNodeFrame/BaseNodeProps"; //Standard props for a node view


/**By writing BaseNodeProps<StaticTextNodeStore>, I am essentially declaring that 
 * the prop interface for this component is 
 * the same as the generic props for a node view, but 
 * the store will specifically be a StaticTextNodeStore. */
interface TextNodeProps extends BaseNodeProps<StaticTextNodeStore>{};

/**This class models the UI for a static Text Node */
@observer
export class TextNodeView extends React.Component<TextNodeProps> {

     /**Renders the content for a Text Node
     * @returns a JSX.Element, the specialized content
     * of the node that will be placed in a frame for viewing
     */
    private renderContent = () => { 
        const store = this.props.store;
        return (
        <>
        <h3 className="title">{store.title}</h3> {/**Title in Heading font */}
        <p className="paragraph">{store.text}</p> {/**Outputs stored text as paragraph*/}</>);
    }

    /**Renders the TextNodeView */
    render() {
        let {store, collection, onFollowLink, onDrag, onDragEnd, onDragStart, isContentOnly} = this.props; //destructure props for easier access
        if (isContentOnly){
            return this.renderContent();
        }
        else{
        return (
        <div className="node textNode"  id={`node-${store.Id}`} style={{
                transform: store.transform,       // position via translate
                width: store.width + "px",        // set width
                height: store.height + "px",      // set height
                position: "absolute"              //absolute positioning so that other nodes aren't affected by transform/resizing!
            }} onWheel={(e: React.WheelEvent) => {
                e.stopPropagation(); //stops propagation of wheel events
                e.preventDefault(); //prevents default event behavior
            }}>
        {/* Now embed the BaseNodeFrame */}
        <BaseNodeFrame store = {store} collection = {collection} onFollowLink = {onFollowLink} onDrag = {onDrag} onDragEnd = {onDragEnd} onDragStart ={onDragStart}>
            {this.renderContent()}
        </BaseNodeFrame>
            </div> 
        );
    }
}
}





