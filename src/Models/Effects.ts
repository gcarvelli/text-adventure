import { DialogOption } from "./Dialog"
import { Config } from "../Configuration/Config";
import { Item } from "./Models";

export abstract class Effect {
    config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    public abstract Execute();
}

export class AddDialogOptionEffect extends Effect {
    targetTree: string;
    dialogOption: DialogOption;
    afterId: string;

    constructor(config: Config, targetTree: string, dialogOption: DialogOption, afterId: string) {
        super(config);
        this.targetTree = targetTree;
        this.dialogOption = dialogOption;
        this.afterId = afterId;
    }

    public Execute() {
        let tree = this.config.dialogTrees[this.targetTree];
        let matches = tree.options.filter(option => {
            return option.id == this.dialogOption.id
        });

        if (matches.length == 0) {
            if (this.afterId) {
                let afterMatches = tree.options.filter(option => {
                    return option.id == this.afterId
                });
                tree.options.splice(tree.options.indexOf(afterMatches[0]) + 1, 0, this.dialogOption);
            } else {
                tree.options.push(this.dialogOption);
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
            tree.options.splice(tree.options.indexOf(matches[0], 1));
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
