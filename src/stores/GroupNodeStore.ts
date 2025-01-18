import { observable } from "mobx";
import { NodeCollectionStore } from "./NodeCollectionStore"; //

/**
 * This is a collection "node" that can also contain child nodes*
 * This class is part of the set-up for nested collections
 * 
 * GroupNodeStore is a specialized or derived version of NodeCollectionStore, but used for nested containers. 
 * 
 * Design Choice:
 * Creating an additional store class for nested collections means that nested collections can be extended later
 * --avoids conflating the root store’s responsibilities with those of an inner group.
 * */
export class GroupNodeStore extends NodeCollectionStore {
    constructor(initializer: Partial<GroupNodeStore>) { //Can pass in props
        super();
        Object.assign(this, initializer); //Copies enumerable values from initializer
    }

    @observable
    public title : string = "default"; //name of the collection
}
