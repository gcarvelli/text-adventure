import { Config } from "../Configuration/Config";
import * as Utilities from "../Utilities/Utilities";

export abstract class AbstractCondition {
    abstract IsMet(config: Config): boolean;
}

export class ItemInInventoryCondition extends AbstractCondition {
    constructor(private itemId: string) {
        super();
    }

    public IsMet(config: Config): boolean {
        return Utilities.FindItemByName(config.player.inventory, this.itemId) !== null;
    }
}

export class ItemInRoomCondition extends AbstractCondition {
    constructor(private itemId: string) {
        super();
    }

    public IsMet(config: Config): boolean {
        return Utilities.FindItemByName(config.player.location.items, this.itemId) !== null;
    }
}

export class PlayerAtLocation extends AbstractCondition {
    constructor(private roomId: string) {
        super();
    }

    public IsMet(config: Config): boolean {
        return config.player.location.id === this.roomId;
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
}

export class ItemIsUnlockedCondition extends AbstractCondition {
    constructor(private itemId: string) {
        super();
    }

    public IsMet(config: Config): boolean {
        let item = config.items[this.itemId];
        return item.open.lock.canLock && item.open.lock.isLocked;
    }
}
