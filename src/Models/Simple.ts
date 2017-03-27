import { Item } from "./Item";
import { Room } from "./Room";

export class Game {
    name: string;
    version: string;
}

export class Player {
    name: string;
    inventory: Item[];
    location: Room;

    constructor() {
        this.inventory = new Array<Item>();
    }
}

export class GameState {
    talkingTo: Item;
}
