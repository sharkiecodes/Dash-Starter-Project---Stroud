import React from 'react';
import './App.scss';
import { NodeCollectionStore } from './stores';
import { CollectionNodeView } from './views/nodes';

/**This class is the entry point for the application. It sets up the main div, which is given a class name of App.
 * Then it instantiates a CollectionNodeView whose store is an empty NodeCollectionStore.
 */
export class App extends React.Component {

    /**
     * Renders the top-level class (CollectionNodeView)
    /* The central screen is composed of a collection of nodes: our main node collection.*/
    render() {
        return (
            <div className="App">
                 {/*App has no need to refer to the NodeCollectionStore after instantiation, so
                  * its reference is *not* assigned to an object to be saved as an instance variables.
                  * This is because all of the further logic will be delegated to the CollectionNodeView, which acts similarly
                  * to a top-level logic class for this program.
                  */}
               <CollectionNodeView store = {new NodeCollectionStore()} isContentOnly = {true}/> {/*Renders content only, i.e, no BaseNodeFrame*/}
            </div>
        );
    }
}
export default App;