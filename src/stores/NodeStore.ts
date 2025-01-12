import { computed, observable } from "mobx";
import { Utils } from "../Utils";

export enum StoreType {
    Text, 
    Video
}

export class NodeStore {

    public Id: string = Utils.GenerateGuid();

    public type: StoreType | null = null;

    @observable
    public x: number = 0;

    @observable
    public y: number = 0;

    @observable
    public width: number = 0;

    @observable
    public height: number = 0;

    @computed
    public get transform(): string {
        return "translate(" + this.x + "px, " + this.y + "px)";
    }
}