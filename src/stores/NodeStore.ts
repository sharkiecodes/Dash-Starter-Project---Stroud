import { computed, observable } from "mobx";
import { Utils } from "../Utils";
import { DEFAULT_NODE_HEIGHT, DEFAULT_NODE_WIDTH } from "../Constants";

export enum StoreType { //expanded to add more node types
    Text, 
    Video,
    Image,
    Website,
    RichText,
    Collection
}



export class NodeStore {

    public Id: string = Utils.GenerateGuid();

    public type: StoreType | null = null;

    @observable
    public x: number = 0;

    @observable
    public y: number = 0;

    @observable
    public width: number = DEFAULT_NODE_WIDTH;

    @observable
    public height: number = DEFAULT_NODE_HEIGHT;

    @computed
    public get transform(): string {
        return "translate(" + this.x + "px, " + this.y + "px)";
    }
}