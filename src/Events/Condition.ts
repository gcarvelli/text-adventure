import { Config } from "../Configuration/Config";
import * as Utilities from "../Utilities/Utilities";

export abstract class Condition {
    abstract IsMet(config: Config): boolean;
    abstract GetFailMessage(config: Config): string;
}

export class ItemInInventoryCondition extends Condition {
    constructor(private itemId: string) {
        super();
    }

    public IsMet(config: Config): boolean {
        return Utilities.FindItemByName(config.player.inventory, this.itemId) !== null;
    }

    public GetFailMessage(config: Config): string {
        if (!config.items.hasOwnProperty(this.itemId)){
            return "You don't have one of those.";
        } else {
            return "You don't have a " + config.items[this.itemId].keywords[0] + ".";
        }
    }
}

export class ItemInCurrentRoomCondition extends Condition {
    constructor(private itemId: string) {
        super();
    }

    public IsMet(config: Config): boolean {
        return Utilities.FindItemByName(config.player.location.items, this.itemId) !== null;
    }

    public GetFailMessage(config: Config): string {
        if (!config.items.hasOwnProperty(this.itemId)){
            return "You don't see one of those around.";
        } else {
            return "You don't see a " + config.items[this.itemId].keywords[0] + " around.";
        }
    }
}

export class PlayerAtLocationCondition extends Condition {
    constructor(private roomId: string) {
        super();
    }

    public IsMet(config: Config): boolean {
        return config.player.location.id === this.roomId;
    }

    public GetFailMessage(config: Config): string {
        return "You need to be somewhere else.";
    }
}

export class ItemIsOpenCondition extends Condition {
    constructor(private itemId: string) {
        super();
    }

    public IsMet(config: Config): boolean {
        let item = config.items[this.itemId];
        return item.open.isOpen;
    }

    public GetFailMessage(config: Config): string {
        return "It isn't open.";
    }
}

export class ItemIsUnlockedCondition extends Condition {
    constructor(private itemId: string) {
        super();
    }

    public IsMet(config: Config): boolean {
        let item = config.items[this.itemId];
        return item.open.lock.canLock && item.open.lock.isLocked;
    }

    public GetFailMessage(config: Config): string {
        return "It's locked.";
    }
}

export class ToggleIsTrueCondition extends Condition {
    constructor(private toggleId: string) {
        super();
    }

    public IsMet(config: Config): boolean {
        return config.state.toggles[this.toggleId];
    }

    public GetFailMessage(config: Config) {
        return "This should probably be a custom message";
    }
}

export class ToggleIsFalseCondition extends Condition {
    constructor(private toggleId: string) {
        super();
    }

    public IsMet(config: Config): boolean {
        return !config.state.toggles[this.toggleId];
    }

    public GetFailMessage(config: Config) {
        return "This should probably be a custom message";
    }
}
