import { NPCDialog } from "./Dialog";
import { IMap } from "../Utilities/Utilities";
import { IEventful } from "../Events/IEventful";
import { Event, EventType } from "../Events/Event";

export class Item implements IEventful {
    id: string;
    name: string;
    keywords: string[];
    description: string;
    descriptionForRoom: string;
    subItems: Item[];
    events: Map<EventType, Event>;

    take: TakeModule;
    open: OpenModule;
    npc: NPCModule;
    door: DoorModule;

    constructor() {
        this.subItems = new Array<Item>();
        this.take = new TakeModule();
        this.open = new OpenModule();
        this.npc = new NPCModule();
        this.door = new DoorModule();
        this.events = new Map<EventType, Event>();
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
            if (this.descriptionForRoom) {
                lines.push ("  " + this.descriptionForRoom);
            } else {
                lines.push("  There is a " + this.name + " here.");
            }
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

    public GetLookAtDescription(): string {
        if (this.open.canOpen) {
            let status: string;
            if (this.open.isOpen) {
                status = "open";
            } else {
                if (this.open.lock && this.open.lock.isLocked) {
                    status = "locked";
                } else {
                    status = "closed";
                }
            }
            return this.description + " The " + this.name + " is " + status + ".";
        } else if (this.door.isDoor) {
            return "The " + this.name + " is " + (this.door.isOpen ? "open." : "closed.");
        } else {
            return this.description ? this.description : "There's nothing special about the " + this.name + ".";
        }
    }

    public GetEvent(id: EventType): Event {
        if (this.events) {
            return this.events[id];
        }
        return null;
    }

    public SetEvent(id: EventType, event: Event) {
        this.events[id] = event;
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
    lock: LockModule;

    constructor() {
        this.contents = new Array<Item>();
        this.lock = new LockModule();
    }
}

export class NPCModule {
    dialog: NPCDialog;
}

export class DoorModule {
    isDoor: boolean;
    isOpen: boolean;
    movement: IMap<string>;
    lock: LockModule;

    constructor() {
        this.movement = { };
        this.lock = new LockModule();
    }
}

export class LockModule {
    canLock: boolean;
    isLocked: boolean;
    keyId: string;
}
