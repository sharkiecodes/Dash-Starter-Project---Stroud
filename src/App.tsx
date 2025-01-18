import React from 'react';
import './App.scss';
import { NodeCollectionStore, NodeStore, StaticTextNodeStore, StoreType, VideoNodeStore, WebsiteNodeStore, ImageNodeStore, RichTextNodeStore, GroupNodeStore } from './stores';
import { FreeFormCanvas } from './views/freeformcanvas/FreeFormCanvas';
import { MAX_X, MAX_Y, NUM_NODES } from './Constants';


const mainNodeCollection = new NodeCollectionStore();

// create a bunch of text and video nodes (you probably want to delete this at some point)
let numNodes: number = NUM_NODES;
let maxX: number = MAX_X;
let maxY: number = MAX_Y;
let nodes: NodeStore[] = [];


// add 150 static text nodes to random locations

for (let i = 0; i < numNodes / 6; i++) {
    nodes.push(new StaticTextNodeStore({ type: StoreType.Text,  x: Math.random() * maxX, y: Math.random() * maxY, title: "Text Node Title", text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?" }));
}


for (let i = 0; i < numNodes / 6; i++) {
    nodes.push(new WebsiteNodeStore({ type: StoreType.Website,  x: Math.random() * maxX, y: Math.random() * maxY, title: "Website Node Title", websiteURL: "https://iframetester.com" }));
}


// add 150 video nodes to random locations
for (let i = 0; i < numNodes / 6; i++) {
    nodes.push(new VideoNodeStore({ type: StoreType.Video, x: Math.random() * maxX, y: Math.random() * maxY, title: "Video Node Title", url: "http://cs.brown.edu/people/peichman/downloads/cted.mp4" }));
}

for (let i = 0; i < numNodes / 6; i++) {
    nodes.push(new RichTextNodeStore({ type: StoreType.RichText,
        x: Math.random() * maxX,
        y: Math.random() * maxY,
        width: 400,
        height: 300,
        title: "Editor",
        content: "<h3>Test!</h3><p>Here is <strong>rich text node</strong>.</p>"}));
}


for (let i = 0; i < numNodes / 6; i++) {
    nodes.push(new ImageNodeStore(new ImageNodeStore({
        type: StoreType.Image,
        x: Math.random() * maxX,
        y: Math.random() * maxY,
        width: 300,
        height: 200,
        title: "Sample Image",
        url: "https://images.squarespace-cdn.com/content/v1/5fbdd355bf71053ccbfd4705/1608868595003-SPI903YQFRX1YOI2BFNG/bernedoodle-puppy-moose.jpg"
    })));
}

for (let i = 0; i < numNodes / 6; i++) {
    // 1) Create a nested collection node:
const nestedCollection = new GroupNodeStore({
    type: StoreType.Collection,
    x: 300,
    y: 300,
    width: 800,
    height: 600
});

// 2) Add some child nodes to that nested collection:
nestedCollection.addNodes([
    new StaticTextNodeStore({
        type: StoreType.Text,
        x: 100,
        y: 100,
        width: 200,
        height: 100,
        title: "Inside Nested Collection",
        text: "Hello from inside the nested collection!"
    }),
    new VideoNodeStore({
        type: StoreType.Video,
        x: 400,
        y: 300,
        width: 320,
        height: 240,
        title: "Nested Video",
        url: "http://some/video.mp4"
    })
]);

//
    nodes.push(nestedCollection);
}
// add set of all test nodes to node collection
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