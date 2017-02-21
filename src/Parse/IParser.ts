
export interface IParser {
    Parse(commandString: string): Command;
}

export enum CommandType {
    Help,
    Custom,
    Move,
    LookAround,
    LookAt,
    Inventory,
    TakeItem,
    DropItem
}

export class Command {
    command: string;
    commandType: CommandType;
    args: string[];

    constructor() {
        this.args = new Array<string>();
    }
}