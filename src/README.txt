Overview:
I implemented the Starter Project, a subset of Dash's features
Thank you very much for the opportunity to try out for the Dash Research Team!

Bells and Whistles
**************************************************************************************************************
Four different views available:
-Freeform
-Staggered Grid
-Grid
-Tree
"Following Links" has different results in GridView vs FreeFormCanvas: 
Following links in FreeFormCanvas causes the canvas to pan to center on the node.
Following links in Grid View causes linked nodes to be highlighted
(involves conditionally changing the className of a div to allow a different scss ruleset to apply)

* Nodes can be dragged and dropped onto each other. Dragging and dropping two non-collection nodes
together creates a new collection where they are merged. Dragging and dropping a node
onto an existing collection adds it to that collection.

* Please press and hold the SHIFT key when dragging two nodes together to create a CompositeNode. 
The concept behind a CompositeNode is based on two main ideas:
1. Combine two or more nodes without creating an entire new subcollection
2. Having a way to arrange multiple nodes' stripped content together inside a single BaseNodeFrame.

* By combining two NodeStores and rendering their stripped-down views (which don't include the clutter of their individual
frames) we create a natural-looking CompositeNode.
This is helpful for when you want to combine nodes without the complexity of a subcollection.

* I further enhanced the CompositeNode idea to include Scrapbooks--preset templates for compositions of 
nodes which can take in one website, one video, etc. and format in a designated way. As it stands,
the current Scrapbook is set up to take one website and one video. An extension of this project could 
be to add more layout formats for scrapbooks.

* Visual arrows were developed using the react-xarrows library, 

* Adaptive Add Node Form:
When I was creating the Add Node Form, I realized that each field defined in a node's store
should be associated with information on what data the user can input in that field in the Add Node Form.
I wrote a FormFieldDecorator that allows fields to be tagged and their information pushed to a FieldDefinitions
array.
This is essential so that if a new field were to be added to a node store, it can easily be decorated with @FormField
to denote the relevant information on how it should appear in the Add Node modal pop-up.
Now, the Add Node pop-up doesn't need to run a big if-else tree that does type-checking to figure out which fields to render.
Through this implementation, it can simply run through a fieldDefinitions array and render the appropriate layout.

* Mouse Trail:
Renders a mouse trail that activates when the user pans.
This is useful for visually identifying when the canvas is being dragged.

***********************************************************************************

Design Choices:
The top-level class is a CollectionNodeView rendered without its BaseNodeFrame.
This makes more sense than having the top-level class be a FreeFormCanvas.
This is because it allows the FreeFormCanvas to exclusively focus on
responsibilities of dragging nodes and panning, as opposed to also managing
how to add nodes or switch views.


As I developed this project, I realized that many components, such as the LinkPanel, RemoveButton, and Topbar,
were repeated throughout each NodeView. Therefore, I used a compositional BaseNodeFrame wrapper to wrap these
components. This makes it easier if in the future, you wanted to add another component to the base frame layout.

I also noticed many NodeViews relied on receiving the same props, so I created a BaseNodeProps interface
which the NodeViews props interfaces implement. This reduces repetition.

In order to implement CompositeNodes, it was necessary for each Node View to be able to decide
whether to render in full or simply render its raw content without a frame. This was achieved
through an isContentOnly prop.


NodeRenderer is a single component to return a NodeView for any node type. This ensures we only maintain one switch,
rather than having to repeat the logic for node instantiation in multiple places.

As recommended, I relied on class components (rather than functional components) throughout this project.

For dragging and dropping nodes onto each other in FreeFormCanvas,
I pulled out the merge logic into a NodeMergeService, which is a service class.
I could've included this in Utils.ts, but decided not to, as the merge logic is only used in FreeFormCanvas
and isn't applicable throuhgout the entirety of the program.

Addressing Edge Cases:
I dealt with some very specific edge cases and addressed the issues as much as possible, such as
whether nodes were untitled, or what kind of nodes might be merged together, and whether there were
existing links on nodes being merged, and formatting of nodes in CompositeNode, etc.

For example, implementing the ability to merge collections into a CompositeNode required the raw collection content to be provided
a bounding width and height.


***********************

Misc. Design Notes:
Staggered Grid view is actually an algorithm in FreeFormCanvas, while GridCanvas relies on .scss rulesets instead.

Pointer Events:
It was often necessary to stop propagation.
For example: in the Rich Text Editor, stop propagation allows you to click
on the various options within the Quill toolbar as well as edit/type text

Often, e.stopPropagation was necessary to prevent the canvas from panning. Otherwise, 
for example, it interprets the selection of a different node type as the mouse continuously being down / 
pressing or highlighting that box.

Minor Coding Syntax Commentary:
I consistently used destructuring lines such as
{ store, collection } = this.props for easy reference
TypeScript looks at the props object and extracts the store and collection properties, creating two new variables store, and collection.


Hours: Took a significant amount of time, likely 130+ hours

 
Closing Notes:
Thank you very much for considering me for the Dash Research Team! I would love to join!
