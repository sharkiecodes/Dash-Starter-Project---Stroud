import { observable } from "mobx";
import { NodeStore } from "./NodeStore";
import {DEFAULT_RICH_WIDTH, DEFAULT_RICH_HEIGHT} from '../Constants'
import { FieldDefinition } from "./FieldDefinition";
import { FormField } from "./FormFieldDecorator";

/**Store class for RichTextNodes-- these nodes will allow text to be edited using QuillJS, which I downloaded*/
export class RichTextNodeStore extends NodeStore {

    public static fieldDefinitions: FieldDefinition[] = [...NodeStore.fieldDefinitions] /*fielddefinitions for richtext node*/
    
    constructor(initializer?: Partial<RichTextNodeStore>) {
        super();
        Object.assign(this, initializer);
    }

    @observable
        public width: number = DEFAULT_RICH_WIDTH;

    @observable
        public height: number = DEFAULT_RICH_HEIGHT;    

    @FormField({ label: "Title", inputType: "string", defaultValue: "New RichText Node" })
    @observable
    public title : string = "Text Node Editor";
  

    @FormField({
        label: "Initial Content (HTML)",
        inputType: "textArea",
        defaultValue: "<p>New rich text node!</p>",
      })
    @observable
    public content: string = "";  // This holds the raw HTML content from Quill
}
