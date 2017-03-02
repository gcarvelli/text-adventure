import { DialogOption } from "./Dialog"
import { Config } from "../Configuration/Config";

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