import { Mode } from "../Engine";

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
    DropItem,
    Open,
    Close,
    TalkTo,
    DialogOption
}

export class Command {
    command: string;
    commandType: CommandType;
    args: string[];

    constructor() {
        this.args = new Array<string>();
    }
}