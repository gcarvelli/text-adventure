
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

export class Item {
    id: string;
    name: string;
    description: string;
    descriptionForRoom: string;

    canTake: boolean;
    wasDropped: boolean;

    canOpen: boolean;
    isOpen: boolean;
    contents: Item[];

    constructor() {
        this.contents = new Array<Item>();
    }
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

    public GetDescription(): string[] {
        let desc = new Array<string>();
        desc.push(this.description);
        this.items.forEach(item => {
            if (item.canOpen) {
                desc.push("  There is a " + item.name + " here.");
                if (item.isOpen && item.contents && item.contents.length > 0) {
                    desc.push("  The " + item.name + " contains:");
                    item.contents.forEach(element => {
                        desc.push("    " + element.name);
                    });
                }
            }

            if (!item.canTake && item.descriptionForRoom) {
                desc[0] += " " + item.descriptionForRoom;
            } else if (item.wasDropped) {
                desc.push("  There is a " + item.name + " here.");
            } else if (item.canTake) {
                desc.push("  " + item.descriptionForRoom);
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
