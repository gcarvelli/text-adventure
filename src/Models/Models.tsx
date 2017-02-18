
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

    constructor(name?: string) {
        this.name = name;
        this.inventory = new Array<Item>();
    }
}

export class Item {
    name: string;
    description: string;
    
    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
    }
}

export class Room {
    id: string;
    name: string;
    description: string;
    moves: null;
    items: Item[];

}

export interface RoomMap {
    [id: string]: Room;
}
