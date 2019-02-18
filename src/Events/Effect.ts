import { Config } from "../Configuration/Config";

export abstract class Effect {
    public abstract Execute(config: Config);
}

export class ChangeNameEffect extends Effect {
    constructor(private targetItem: string, private newName: string) {
        super();
    }

    public Execute(config: Config) {
        config.GetItem(this.targetItem).name = this.newName;
    }
}

export class ChangeDescriptionForRoomEffect extends Effect {
    constructor(private itemid: string, private newDescription: string) {
        super();
    }

    public Execute(config: Config) {
        config.GetItem(this.itemid).descriptionForRoom = this.newDescription;
    }
}

export class AddItemToInventoryEffect extends Effect {
    constructor(private itemId: string) {
        super();
    }

    public Execute(config: Config) {
        let item = config.GetItem(this.itemId);
        if (item) {
            config.player.inventory.push(item);
        }
    }
}

export class AddKeywordsToItemEffect extends Effect {
    constructor(private itemId: string, private keywords: string[]) {
        super();
    }

    public Execute(config: Config) {
        let item = config.GetItem(this.itemId);
        if (item) {
            this.keywords.forEach(keyword => {
                if (item.keywords.indexOf(keyword) == -1) {
                    item.keywords.push(keyword);
                }
            });
        }
    }
}

export class SetToggleToTrueEffect extends Effect {
    constructor(private toggleId: string) {
        super();
    }

    public Execute(config: Config) {
        config.state.toggles[this.toggleId] = true;
    }
}

export class SetToggleToFalseEffect extends Effect {
    constructor(private toggleId: string) {
        super();
    }

    public Execute(config: Config) {
        config.state.toggles[this.toggleId] = false;
    }
}
