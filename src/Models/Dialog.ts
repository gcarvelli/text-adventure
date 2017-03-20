import { Effect } from "./Effects";

export class NPCDialog {
    greeting: string;
    startTree: string;
}

export class DialogTree {
    id: string;
    options: DialogOption[];

    constructor() {
        this.options = new Array<DialogOption>();
    }
}

export class DialogOption {
    id: string;
    choice: string;
    response: string;
    effects: Effect[];

    hasBeenChosen: boolean;

    constructor() {
        this.effects = new Array<Effect>();
    }

    public RunEffects() {
        this.effects.forEach(effect => {
            effect.Execute();
        });
    }
}

export interface DialogTreeMap {
    [id: string]: DialogTree;
}

export interface DialogOptionMap {
    [id: string]: DialogOption;
}
