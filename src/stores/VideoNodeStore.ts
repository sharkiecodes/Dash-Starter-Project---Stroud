import { observable } from "mobx";
import { NodeStore } from "./NodeStore";
import { FormField } from "./FormFieldDecorator";
import { FieldDefinition } from "./FieldDefinition";

export class VideoNodeStore extends NodeStore {

    constructor(initializer?: Partial<VideoNodeStore>) {
        super();
        Object.assign(this, initializer);
    }
    /*Represents fieldDefinitions for a VideoNodeStore*/
    public static fieldDefinitions: FieldDefinition[] = [
        ...NodeStore.fieldDefinitions
      ];

    @FormField({ label: "Title", inputType: "string", defaultValue: "New Video Node" })
    @observable
    public title: string | undefined;
  
    @FormField({ label: "Video URL", inputType: "string", defaultValue: "http://cs.brown.edu/people/peichman/downloads/cted.mp4" })
    @observable
    public url: string | undefined; //video url
    

}