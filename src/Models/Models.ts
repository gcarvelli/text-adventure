import { NPCDialog } from "./Dialog";

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
            if (item.open.canOpen) {
                desc.push("  There is a " + item.GetName() + " here.");
                if (item.open.isOpen && item.open.contents && item.open.contents.length > 0) {
                    desc.push("  The " + item.GetName() + " contains:");
                    item.open.contents.forEach(element => {
                        desc.push("    " + element.GetName());
                    });
                }
            } else if (item.npc.dialog) {
                desc.push("  " + (item.descriptionForRoom ? item.descriptionForRoom :
                "There is a " + item.GetName() + " here."));
            } else if (!item.take.canTake && item.descriptionForRoom) {
                desc[0] += " " + item.descriptionForRoom;
            } else if (item.take.canTake && item.take.wasDropped) {
                desc.push("  There is a " + item.GetName() + " here.");
            } else if (item.take.canTake) {
                desc.push("  " + item.descriptionForRoom);
            }
        });

        return desc;
    }
}

export class Item {
    id: string;
    name: string;
    keywords: string[];
    description: string;
    descriptionForRoom: string;
    subItems: Item[];

    take: TakeModule;
    open: OpenModule;
    weapon: WeaponModule;
    npc: NPCModule;

    constructor() {
        this.subItems = new Array<Item>();
        this.take = new TakeModule();
        this.open = new OpenModule();
        this.weapon = new WeaponModule();
        this.npc = new NPCModule();
    }

    public HasKeyword(name: string): boolean {
        let match = false;
        this.keywords.forEach(val => {
            if (val == name) match = true;
        });
        return match;
    }

    public GetName(): string {
        return this.name;
    }
}

export class TakeModule {
    canTake: boolean;
    wasDropped: boolean;
}

export class OpenModule {
    canOpen: boolean;
    isOpen: boolean;
    contents: Item[];

    constructor() {
        this.contents = new Array<Item>();
    }
}

export class WeaponModule {
    isWeapon: boolean;
    baseDamage: number;
    damageSpread: number;
}

export class NPCModule {
    dialog: NPCDialog;
}

export interface RoomMap {
    [id: string]: Room;
}

export interface MoveMap {
    [id: string]: string;
}

export interface ItemMap {
    [id: string]: Item
}
