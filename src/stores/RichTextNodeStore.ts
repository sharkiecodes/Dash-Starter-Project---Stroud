import { observable } from "mobx";
import { NodeStore } from "./NodeStore";
import {DEFAULT_RICH_WIDTH, DEFAULT_RICH_HEIGHT} from '../Constants'

/**Store class for RichTextNodes-- these nodes will allow text to be edited using QuillJS, which I downloaded*/
export class RichTextNodeStore extends NodeStore {
    constructor(initializer: Partial<RichTextNodeStore>) {
        super();
        Object.assign(this, initializer);
    }

    @observable
        public width: number = DEFAULT_RICH_WIDTH;

    @observable
        public height: number = DEFAULT_RICH_HEIGHT;    

    @observable
    public title : string = "Text Node Editor";
  
    @observable
    public content: string = "";  // This holds the raw HTML content from Quill
}
