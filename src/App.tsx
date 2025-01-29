import React from 'react';
import './App.scss';
import { NodeCollectionStore } from './stores';
import { FreeFormCanvas } from './views/CanvasViews/FreeFormCanvas/FreeFormCanvas';
import { MouseTrailStore } from './stores/MouseTrailStore';
import { CollectionNodeView } from './views/nodes';

/**This class is the entry point for the application. It sets up the main div, which is given a class name of App.
 * Then it instantiates a FreeFormCanvas whose store is an empty NodeCollectionStore. It also passes in a mouse trail
 * which appears on the FreeFormCanvas.
 */
export class App extends React.Component {

    /**
     * Renders the top-level class (FreeFormCanvas)
    /* The central screen is composed of a freeformcanvas which is composed of a main node collection.*/
    render() {
        return (
            <div className="App">
                 {/*App has no need to refer to the NodeCollectionStore or MouseTrailStore after instantiation, so
                  * they are not saved as instance variables.
                  * This is because all of the further logic will be delegated to FreeFormCanvas, which acts similarly
                  * to a top-level logic class for this program.
                  */}
               <CollectionNodeView store = {new NodeCollectionStore()} isContentOnly = {true}/>
              {/**<FreeFormCanvas store={new NodeCollectionStore()}   mouseTrailStore={new MouseTrailStore()} /> */}
            </div>
        );
    }
}
export default App;