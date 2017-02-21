
export class Game {
    name: string;
    version: string;
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
    descriptionForRoom: string;
}

export class Room {
    id: string;
    name: string;
    description: string;
    moves: MoveMap;
    items: Item[];

    constructor() {
        this.moves = { };
        this.items = new Array<Item>();
    }

    public GetDescription(): string {
        let desc = this.description;
        this.items.forEach(item => {
            if (item.descriptionForRoom) {
                desc += " " + item.descriptionForRoom;
            }
        });

        return desc;
    }
}

export interface RoomMap {
    [id: string]: Room;
}

export interface MoveMap {
    [id: string]: string;
}
