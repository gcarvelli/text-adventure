
export interface IParser {
    Parse(commandString: string): Command;
}

export enum CommandType {
    Unknown,
    Move,
    LookAround,
    LookAt
}

export class Command {
    command: string;
    commandType: CommandType;
    args: String[];

    constructor() {
        this.args = new Array<String>();
    }
}