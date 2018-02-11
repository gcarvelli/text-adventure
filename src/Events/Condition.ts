import { Config } from "../Configuration/Config";
import * as Utilities from "../Utilities/Utilities";

export abstract class AbstractCondition {
    abstract IsMet(config: Config): boolean;
    abstract GetFailMessage(config: Config): void;
}

export class ItemInInventoryCondition extends AbstractCondition {
    constructor(private itemId: string) {
        super();
    }

    public IsMet(config: Config): boolean {
        return Utilities.FindItemByName(config.player.inventory, this.itemId) !== null;
    }

    public GetFailMessage(config: Config) {
        return "You don't have one of those.";
    }
}

export class ItemInCurrentRoomCondition extends AbstractCondition {
    constructor(private itemId: string) {
        super();
    }

    public IsMet(config: Config): boolean {
        return Utilities.FindItemByName(config.player.location.items, this.itemId) !== null;
    }

    public GetFailMessage(config: Config) {
        return "You don't see one of those around.";
    }
}

export class PlayerAtLocation extends AbstractCondition {
    constructor(private roomId: string) {
        super();
    }

    public IsMet(config: Config): boolean {
        return config.player.location.id === this.roomId;
    }

    public GetFailMessage(config: Config) {
        return "You need to be somewhere else.";
    }
}

export class ItemIsOpenCondition extends AbstractCondition {
    constructor(private itemId: string) {
        super();
    }

    public IsMet(config: Config): boolean {
        let item = config.items[this.itemId];
        return item.open.isOpen;
    }

    public GetFailMessage(config: Config) {
        return "It isn't open.";
    }
}

export class ItemIsUnlockedCondition extends AbstractCondition {
    constructor(private itemId: string) {
        super();
    }

    public IsMet(config: Config): boolean {
        let item = config.items[this.itemId];
        return item.open.lock.canLock && item.open.lock.isLocked;
    }

    public GetFailMessage(config: Config) {
        return "It's locked.";
    }
}
