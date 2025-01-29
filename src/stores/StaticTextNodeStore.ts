import { observable } from "mobx";
import { NodeStore } from "./NodeStore";
import { FieldDefinition } from "./FieldDefinition";
import { FormField } from "./FormFieldDecorator";

export class StaticTextNodeStore extends NodeStore {

    /*
     * A static list describing which fields the user
     * should fill in when creating a StaticTextNode.
     *
    * The decorator will push to StaticTextNodeStore.fieldDefinitions */

  // Initially copying the base array to get the base fields
  //   to appear in StaticTextNodeStore's array array. 
  //    Now both "title" and
  //   "text" will show up upon reading `StaticTextNodeStore.fieldDefinitions`.
    public static fieldDefinitions: FieldDefinition[] = [
    ...NodeStore.fieldDefinitions]; //merge the base fields with the text-specific fields
    
    

    constructor(initializer?: Partial<StaticTextNodeStore>) {
        /**
         An object of type Partial<StaticTextNodeStore> means that the object passed into it will have the properties of a StaticTextNodeStore (title and text, below), as well as the properties of a NodeStore, which it inherits from. 
         Additionally, the Partial<> bit makes all these properties optional, so the object passed in may not have all these properties.
         */
        super();
        Object.assign(this, initializer);

        /*
        the line above is equivalent to:

        this.x = initializer.x;
        this.y = initializer.y;
        this.title = initializer.title;
        this.text = initializer.text;
        */
    }

    @FormField ({ label: "Title", inputType: "string", defaultValue: "New Text Node"})
    @observable
    public title: string = "";

    @FormField({ label: "Text Content", inputType: "textArea", defaultValue: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." })
    @observable
    public text: string = "";
}