/**This class stores information for websiteNodes, extending the base NodeStore with additional information
 * for title and websiteURL
*/
import { observable } from "mobx";
import { NodeStore } from "./NodeStore";
import { FieldDefinition } from "./FieldDefinition";
import { FormField } from "./FormFieldDecorator";


export class WebsiteNodeStore extends NodeStore {

      public static fieldDefinitions: FieldDefinition[] = [
        ...NodeStore.fieldDefinitions
      ];

    constructor(initializer?: Partial<WebsiteNodeStore>) {
        super();
        Object.assign(this, initializer);
    }
   
    @FormField({ label: "Title", inputType: "string", defaultValue: "New Website Node" })
    @observable
    public title: string | undefined;
  
    @FormField({ label: "Website URL", inputType: "url", defaultValue: "https://www.wikipedia.com" })
    @observable
    public websiteURL: string | undefined;

}

