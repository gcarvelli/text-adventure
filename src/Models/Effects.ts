import { DialogOption } from "./Dialog"
import { Config } from "../Configuration/Config";
import { Item } from "./Item";

export abstract class Effect {
    config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    public abstract Execute();
}

export class AddDialogOptionEffect extends Effect {
    targetTree: string;
    dialogOptionId: string;
    afterId: string;

    constructor(config: Config, targetTree: string, dialogOptionId: string, afterId: string) {
        super(config);
        this.targetTree = targetTree;
        this.dialogOptionId = dialogOptionId;
        this.afterId = afterId;
    }

    public Execute() {
        let tree = this.config.dialogTrees[this.targetTree];
        let matches = tree.options.filter(option => {
            return option.id == this.dialogOptionId;
        });

        if (matches.length == 0) {
            if (this.afterId) {
                let afterMatches = tree.options.filter(option => {
                    return option.id == this.afterId;
                });
                if (afterMatches.length != 0) {
                    tree.options.splice(tree.options.indexOf(afterMatches[0]) + 1, 0, this.config.dialogOptions[this.dialogOptionId]);
                } else {
                    throw new Error("Afterid " + this.afterId + " not found in tree " + tree.id);
                }
            } else {
                tree.options.push(this.config.dialogOptions[this.dialogOptionId]);
            }
        }
    }
}

export class RemoveDialogOptionEffect extends Effect {
    targetTree: string;
    optionId: string;

    constructor(config: Config, targetTree: string, optionId: string) {
        super(config);
        this.targetTree = targetTree;
        this.optionId = optionId;
    }

    public Execute() {
        let tree = this.config.dialogTrees[this.targetTree];
        let matches = tree.options.filter(option => {
            return option.id == this.optionId;
        });

        if (matches.length != 0) {
            tree.options.splice(tree.options.indexOf(matches[0]), 1);
        }
    }
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
