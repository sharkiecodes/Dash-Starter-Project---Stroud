/**This class stores information for ImageNodes, extending the base NodeStore with additional information
 * for title and imageURL
*/
import { observable } from "mobx";
import { NodeStore } from "./NodeStore";
import { FieldDefinition } from "./FieldDefinition";
import { FormField } from "./FormFieldDecorator";


export class ImageNodeStore extends NodeStore {

   /*List of field definitinos for an Image Node */ 
   public static fieldDefinitions: FieldDefinition[] = [
    ...NodeStore.fieldDefinitions //spread the base node's field definitions
  ];
    
    /**
     * Creates a new ImageNodeStore, assigning any supplied fields.
     * @param initializer - Partial initialization object.
     */
    constructor(initializer?: Partial<ImageNodeStore>) {
        super();
        Object.assign(this, initializer);
    }

    @FormField({ label: "Title", inputType: "string", defaultValue: "New Image Node" })
    @observable
    public title: string = ""; //Title of the node
  
    @FormField({ label: "Image URL", inputType: "url", defaultValue: "https://images.squarespace-cdn.com/content/v1/5fbdd355bf71053ccbfd4705/1608868595003-SPI903YQFRX1YOI2BFNG/bernedoodle-puppy-moose.jpg"
})
    @observable
    public url: string = ""; //URL for the image the node will render. Default image url is a Bernese Mountain Dog :)
}
