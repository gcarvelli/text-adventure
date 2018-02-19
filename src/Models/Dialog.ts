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

    hasBeenChosen: boolean;
}
