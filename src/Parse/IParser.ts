export interface IParser {
    Parse(commandString: string): Command;
}

export enum CommandType {
    Empty,
    Help,
    Custom,
    Move,
    LookAround,
    LookAt,
    Inventory,
    TakeItem,
    DropItem,
    Open,
    Close,
    TalkTo,
    Number
}

export class Command {
    command: string;
    commandType: CommandType;
    args: string[];

    constructor() {
        this.args = new Array<string>();
    }
}
