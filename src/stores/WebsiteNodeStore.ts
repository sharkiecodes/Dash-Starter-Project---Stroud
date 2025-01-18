/**This class stores information for websiteNodes, extending the base NodeStore with additional information
 * for title and websiteURL
*/


import { observable } from "mobx";
import { NodeStore } from "./NodeStore";
import { DEFAULT_WEBSITE_HEIGHT, DEFAULT_WEBSITE_WIDTH } from "../Constants";

export class WebsiteNodeStore extends NodeStore {
    constructor(initializer: Partial<WebsiteNodeStore>) {
        super();
        Object.assign(this, initializer);
    }

    @observable
    public title: string | undefined;

    @observable
    public websiteURL: string | undefined;

    @observable
    public width: number = DEFAULT_WEBSITE_WIDTH;
    
    @observable
    public height: number = DEFAULT_WEBSITE_HEIGHT;

}

