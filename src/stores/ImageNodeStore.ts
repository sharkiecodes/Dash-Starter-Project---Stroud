/**This class stores information for ImageNodes, extending the base NodeStore with additional information
 * for title and imageURL
*/
import { observable } from "mobx";
import { NodeStore } from "./NodeStore";

export class ImageNodeStore extends NodeStore {
    constructor(initializer: Partial<ImageNodeStore>) {
        super();
        Object.assign(this, initializer);
    }

    @observable
    public title : string = "";

    @observable
    public url : string = ""; //Url for image source
}
