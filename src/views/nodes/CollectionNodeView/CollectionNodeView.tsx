import { observer } from "mobx-react";
import * as React from 'react';
import { NodeCollectionStore, MouseTrailStore } from "../../../stores";
import { FreeFormCanvas } from "../../CanvasViews/FreeFormCanvas/FreeFormCanvas";
import { LayoutMode } from "../../../stores/NodeCollectionStore";
import "./../NodeView.scss";
import "./CollectionNodeView.scss"; //Import scss after NodeView to ensure CollectionNodeView's scss stylings take precedence
import { GridCanvas } from "../../CanvasViews/GridView/GridCanvas";
import { TreeCanvas } from "../../CanvasViews/TreeView/TreeCanvas/TreeCanvas"; 
import { BaseNodeProps } from "../BaseNodeFrame/BaseNodeProps";
import { BaseNodeFrame } from "../BaseNodeFrame/BaseNodeFrame";
import { AddNodeToolbar } from "../../AddNodeToolbar/AddNodeToolbar";

interface CollectionNodeProps extends BaseNodeProps<NodeCollectionStore>{}

/**Represents a collection of nodes */
@observer
export class CollectionNodeView extends React.Component<CollectionNodeProps> {

    onChangeLayoutMode = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // Switch the store’s layoutMode property
        this.props.store.layoutMode = e.target.value as LayoutMode;
    };

    interceptClick = (e: React.PointerEvent) => {
        e.stopPropagation();
    }
    renderContent = () => {
    const store = this.props.store;
    return (<>
        {/* Toggle button to switch between freeform and grid */}
        {/* SELECT to choose which layout mode */}
        {/* Layout Mode Toggle */}
         <div className="layout-select">
           <label>
               View Mode: 
               <select value={store.layoutMode} onChange={this.onChangeLayoutMode} onPointerDown={this.interceptClick}>
               {/* Use enum values as string: LayoutMode.Freeform => "freeform", LayoutMode.Grid => "grid" */}
               <option value={LayoutMode.Freeform}>Freeform</option>
               <option value={LayoutMode.Grid}>Grid</option>
               <option value={LayoutMode.Tree}>Tree</option>
               </select>
           </label>
           </div>
       <h3 className="title">{store.title}</h3>    
       <br></br>
       {/* Now render the *child* nodes in their own freeform canvas. */}
       <div className="collection-content">
           {/* Now conditionally render the layout */}
           {/* Conditionally render the chosen layout */}
           {store.layoutMode === LayoutMode.Freeform && (
               <FreeFormCanvas store={store} mouseTrailStore={new MouseTrailStore()} /> //added mouse trail store jan29
             )}
             {store.layoutMode === LayoutMode.Grid && (
               <GridCanvas store={store} />
             )}
             {store.layoutMode === LayoutMode.Tree && (
               <TreeCanvas store={store}/>
             )} </div>
            {/* UI to select a node type and add a new node */}
            <AddNodeToolbar store = {store}/>
              </>)
    }
            

    render() {
        const {store, collection, onFollowLink, onDrag, onDragEnd, onDragStart, isContentOnly} = this.props;

            if (isContentOnly){
                return this.renderContent();
            }
            else{
                return(
            <div 
                className="node collectionNode" id={`node-${store.Id}`} 
                style={{ transform: store.transform,
                    width: store.width + "px",
                    height: store.height + "px",
                    position: "absolute"}}
            >
                {/* The top bar allows dragging the entire sub-collection node. */}
               <BaseNodeFrame store = {store} isContentOnly = {false} collection = {collection} onFollowLink = {onFollowLink} onDrag = {onDrag} onDragEnd = {onDragEnd} onDragStart ={onDragStart}>
    
               {this.renderContent()}
              
            </BaseNodeFrame>
            </div>
        );
    }}
}
