import { Config } from "../Configuration/Config";
import { Item } from "../Models/Models";

export abstract class Effect {
    config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    public abstract Execute();
}

export class ChangeNameEffect extends Effect {
    targetItem: string;
    newName: string;

    constructor(config: Config, targetItem: string, newName: string) {
        super(config);
        this.targetItem = targetItem;
        this.newName = newName;
    }

    public Execute() {
        this.config.GetItem(this.targetItem).name = this.newName;
    }
}

export class ChangeDescriptionForRoomEffect extends Effect {
    targetItem: string;
    newDescription: string;

    constructor(config: Config, targetItem: string, newDescription: string) {
        super(config);
        this.targetItem = targetItem;
        this.newDescription = newDescription;
    }

    public Execute() {
        this.config.GetItem(this.targetItem).descriptionForRoom = this.newDescription;
    }
}

export class AddItemToInventoryEffect extends Effect {
    itemId: string;

    constructor(config: Config, itemId: string) {
        super(config);
        this.itemId = itemId;
    }

    public Execute() {
        let item = this.config.GetItem(this.itemId);
        if (item) {
            this.config.player.inventory.splice(this.config.player.inventory.length, 0, item);
        }
    }
}

export class AddKeywordToItemEffect extends Effect {
    itemId: string;
    keywords: string[];

    constructor(config: Config, itemId: string, keywords: string[]) {
        super(config);
        this.itemId = itemId;
        this.keywords = keywords;
    }

    public Execute() {
        let item = this.config.GetItem(this.itemId);
        if (item) {
            this.keywords.forEach(keyword => {
                if (item.keywords.indexOf(keyword) == -1) {
                    item.keywords.push(keyword);
                }
            });
        }
    }
}
