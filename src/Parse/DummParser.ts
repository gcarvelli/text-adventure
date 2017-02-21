import { IParser, Command, CommandType } from "./IParser";

export class DummParser implements IParser {
    Parse(commandString: string): Command {
        let com = new Command();
        com.command = commandString.toLowerCase();
        let tokens = com.command.split(/\s+/);

        if (tokens.length == 0) {
            return null;
        } else if (this.StartsWith(tokens, "look", "at")) {
            com.commandType = CommandType.LookAt;
            if (tokens.length >= 3) {
                com.args.push(tokens.slice(2, tokens.length).join(" "));
            }
        } else if (this.StartsWith(tokens, "l") || this.StartsWith(tokens, "look") || this.StartsWith(tokens, "clear")) {
            com.commandType = CommandType.LookAround;
        } else if (this.StartsWith(tokens, "i") || this.StartsWith(tokens, "inventory")) {
            com.commandType = CommandType.Inventory;
        } else if (["north", "south", "east", "west"].indexOf(tokens[0]) != -1){
            com.commandType = CommandType.Move;
            com.args = tokens;
        } else if (this.StartsWith(tokens, "take")) {
            com.commandType = CommandType.TakeItem;
            if (tokens.length >= 2) {
                com.args.push(tokens.slice(1, tokens.length).join(" "));
            }
        } else if (this.StartsWith(tokens, "drop")) {
            com.commandType = CommandType.DropItem;
            if (tokens.length >= 2) {
                com.args.push(tokens.slice(1, tokens.length).join(" "));
            }
        } else {
            com.commandType = CommandType.Custom;
            com.args = tokens;
        }
        
        return com;
    }

    private StartsWith(tokens: string[], ...args: string[]): boolean {
        for (let i = 0; i < args.length; i++) {
            if (i >= tokens.length || tokens[i] != args[i]) {
                return false;
            }
        }
        return true;
    }
}