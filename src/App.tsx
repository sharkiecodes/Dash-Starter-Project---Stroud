import React from 'react';
import './App.scss';
import { NodeCollectionStore, NodeStore, StaticTextNodeStore, StoreType, VideoNodeStore } from './stores';
import { FreeFormCanvas } from './views/freeformcanvas/FreeFormCanvas';


const mainNodeCollection = new NodeCollectionStore();

// create a bunch of text and video nodes (you probably want to delete this at some point)
let numNodes: number = 300;
let maxX: number = 10000;
let maxY: number = 10000;
let nodes: NodeStore[] = [];

// add 150 static text nodes to random locations
for (let i = 0; i < numNodes / 2; i++) {
    nodes.push(new StaticTextNodeStore({ type: StoreType.Text, x: Math.random() * maxX, y: Math.random() * maxY, title: "Text Node Title", text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?" }));
}

// add 150 video nodes to random locations
for (let i = 0; i < numNodes / 2; i++) {
    nodes.push(new VideoNodeStore({ type: StoreType.Video, x: Math.random() * maxX, y: Math.random() * maxY, title: "Video Node Title", url: "http://cs.brown.edu/people/peichman/downloads/cted.mp4" }));
}

// add set of 300 nodes to node collection
mainNodeCollection.addNodes(nodes);

export class App extends React.Component {
    render() {
        return (
            <div className="App">
              <FreeFormCanvas store={mainNodeCollection} /> 
            </div>
        );
    }
}

export default App;