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
            desc[0] += item.GetDescriptionAddition();
            item.GetDescriptionAdditionLines().forEach((line) => {
                desc.push(line);
            });
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
    door: DoorModule;

    constructor() {
        this.subItems = new Array<Item>();
        this.take = new TakeModule();
        this.open = new OpenModule();
        this.weapon = new WeaponModule();
        this.npc = new NPCModule();
        this.door = new DoorModule();
    }

    public HasKeyword(name: string): boolean {
        let match = false;
        this.keywords.forEach(val => {
            if (val == name) match = true;
        });
        return match;
    }

    public GetDescriptionAdditionLines(): string[] {
        let lines = new Array<string>();
        if (this.open.canOpen) {
            lines.push("  There is a " + this.name + " here.");
            if (this.open.isOpen && this.open.contents && this.open.contents.length > 0) {
                lines.push("  The " + this.name + " contains:");
                this.open.contents.forEach(element => {
                    lines.push("    " + element.name);
                });
            }
        } else if (this.npc.dialog) {
            lines.push("  " + (this.descriptionForRoom ? this.descriptionForRoom :
            "There is a " + this.name + " here."));
        } else if (this.door.isDoor) {
            lines.push("  The " + this.name + " is " + (this.door.isOpen ? "open." : "closed."));
        } else if (this.take.canTake) {
            if (this.take.wasDropped || !this.descriptionForRoom) {
                lines.push("  There is a " + this.name + " here.");
            } else {
                lines.push("  " + this.descriptionForRoom);
            }
        }
        return lines;
    }

    public GetDescriptionAddition(): string {
        if (!this.open.canOpen && !this.npc.dialog && !this.door.isDoor &&
            !this.take.canTake && this.descriptionForRoom) {
            return this.descriptionForRoom;
        }
        return "";
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

export class DoorModule {
    isDoor: boolean;
    isOpen: boolean;
    movement: MoveMap;

    constructor() {
        this.movement = { };
    }
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
