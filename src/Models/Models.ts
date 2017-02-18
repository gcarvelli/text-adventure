
export class Game {
    name: string;
    version: string;

    constructor(name: string, version: string) {
        this.name = name;
        this.version = version;
    }
}

export class Player {
    name: string;
    inventory: Item[];
    location: Room;

    constructor();

    constructor() {
        this.inventory = new Array<Item>();
    }
}

export class Item {
    id: string;
    name: string;
    description: string;
}

export class Room {
    id: string;
    name: string;
    description: string;
    moves: null;
    items: Item[];

    constructor() {
        this.items = new Array<Item>();
    }
}

export interface RoomMap {
    [id: string]: Room;
}
