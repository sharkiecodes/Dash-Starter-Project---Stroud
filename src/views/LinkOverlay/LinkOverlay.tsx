// LinkOverlay.tsx
import { observer } from "mobx-react";
import * as React from "react";
import Xarrow, { Xwrapper } from "react-xarrows";
import { NodeCollectionStore } from "../../stores";
import "./LinkOverlay.scss";
import { ARROW_SIZE, ARROW_CURVENESS, ARROWHEAD_COLOR, ARROW_LINE_COLOR } from "../../Constants";


interface LinkOverlayProps {
    collection: NodeCollectionStore;
  }
  
  /**
   * Renders arrows for all the links between nodes in a given collection,
   * using react-xarrows library
   * Since a CSS transform (like translateX/translateY) was applied to the freeformcanvas container, the underlying HTML 
    * elements have their own coordinate space. 
    * Libraries like react-xarrows rely on 
    * comparing the actual positions of the “start” and “end” DOM elements to draw arrows. 
    * react-xarrows will measure the actual screen positions of each node and draw lines accordingly.
    * without directly caring whether the parent container is heavily transformed.*/
  
  @observer
  export class LinkOverlay extends React.Component<LinkOverlayProps> {
    render() {
    const { collection } = this.props;
  
    return(
    <div className="linkoverlay-container">
      <Xwrapper>
        {collection.nodes.map((node) =>
          node.links.map((linkedNode) => {
            /**Force read of each linked node's x, y, and links array so MobX knows to re-render:
            * No need to read the active node's x and y itself, because every link is bi-directional, 
             * so the active "node" referred to by collection.nodes.map is also a linkedNode for another node*/
            void (linkedNode.height + linkedNode.width + linkedNode.x + linkedNode.y + collection.panX + collection.panY);
            /**The necessity of the line above is a quirk of the react-xarrows library.
             * I want the arrows to react to changes to a node's observable properties, however,
             * although LinkOverlay is marked as an observer class, it still needs to refer to the
             * observable properties within its code in order for mobX to trigger reactive re-rendering.
             * 
             * Because react-xarrows is implemented to directly measure
             *  arrows based on the DOM elements themselves (their bounding boxes on the
             * DOM page), it doesn't actually need to have store data props passed in. 
             * Additionally, their monitorDOMChanges property was also removed as of the version I'm using,
             * so I also couldn't rely on that to trigger re-rendering.
             * 
             * Basically, it comes down to the fact that they don't use mobX to track state like we do.
             * 
             * While there is another built-in solution for the issue of reactively updating to DOM changes in the
             * version I'm using, it relies on evaluation of Xwrapper and useXarrow hook. Since the starter project handout
             * stated that class components and MobX were strongly recommended, I decided to simply reference
             * the observable properties in a one-line statement as opposed to implementing react-xarrows
             * using functional components in order to achieve reactive arrow updating.
             * 
             */


            // Prevent duplicate arrows: only render when node.Id < linkedNode.Id
            if (node.Id < linkedNode.Id) {
              return (
                <Xarrow 
                /**The following props control the geometry or behavior of the arrows, and cannot
                 * be placed in the scss file instead. The scss file is responsible for standard stylings such as
                 *  strokeWidth and color.
                 */
                  key={`arrow-${node.Id}-${linkedNode.Id}`}


                  /**Each node’s container element should have id={"node-" + store.Id} in its JSX.
                   * This allows us to link between nodes
                  */
                  start={`node-${node.Id}`}
                  end={`node-${linkedNode.Id}`}
                  curveness={ARROW_CURVENESS}
                 // path = {"grid"}
                  animateDrawing = {true} //animates the drawing of the arrow
                  showTail = {true} //I want linking to visibly be bidrectional. Showing an arrow on the tail accomplishes this
                  headSize = {ARROW_SIZE} //size relative to stroke thickness
                  tailSize = {ARROW_SIZE}
                  headColor = {ARROWHEAD_COLOR}
                  tailColor= {ARROWHEAD_COLOR}
                  lineColor= {ARROW_LINE_COLOR}
                  /* Apply custom CSS class for styling */
                  passProps={{ className: "link-arrow" }}
                />
              );
            }
            return null; // only render one arrow per pair!
          })
        )}
      </Xwrapper>
    </div>
  );
};
}
