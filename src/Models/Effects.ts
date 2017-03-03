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

    constructor(config: Config, targetTree: string, dialogOption: DialogOption) {
        super(config);
        this.targetTree = targetTree;
        this.dialogOption = dialogOption;
    }

    public Execute() {
        this.config.dialogTrees[this.targetTree].options.push(this.dialogOption);
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