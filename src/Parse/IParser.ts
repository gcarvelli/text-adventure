
export interface IParser {
    Parse(commandString: string): Command;
}

export enum CommandType {
    Custom,
    Move,
    LookAround,
    LookAt,
    Inventory
}

export class Command {
    command: string;
    commandType: CommandType;
    args: string[];

    constructor() {
        this.args = new Array<string>();
    }
}