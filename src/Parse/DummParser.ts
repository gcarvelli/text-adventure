import { IParser, Command, CommandType } from "./IParser";
import { Mode } from "../Engine/Engine";

export class DummParser implements IParser {
    Parse(commandString: string): Command {
        let com = new Command();
        com.command = commandString.toLowerCase().trim();
        let tokens = com.command.split(/\s+/);

        if (tokens.length == 0 || (tokens.length == 1 && tokens[0] == "")) {
            com.commandType = CommandType.Empty;
        } else if (this.StartsWith(tokens, "look", "at")) {
            com.commandType = CommandType.LookAt;
            if (tokens.length >= 3) {
                com.args.push(this.GetThing(tokens.slice(2, tokens.length)));
            }
        } else if (this.StartsWith(tokens, "l") || this.StartsWith(tokens, "look") || this.StartsWith(tokens, "clear")) {
            com.commandType = CommandType.LookAround;
        } else if (this.StartsWith(tokens, "i") || this.StartsWith(tokens, "inventory")) {
            com.commandType = CommandType.Inventory;
        } else if (["north", "south", "east", "west"].indexOf(tokens[0]) != -1){
            com.commandType = CommandType.Move;
            com.args = tokens;
        } else if (["n", "s", "e", "w"].indexOf(tokens[0]) != -1) {
            com.commandType = CommandType.Move;
            switch (tokens[0]) {
                case "n": tokens[0] = "north"; break;
                case "s": tokens[0] = "south"; break;
                case "e": tokens[0] = "east"; break;
                case "w": tokens[0] = "west"; break;
            }
            com.args = tokens;
        } else if (this.StartsWith(tokens, "take")) {
            com.commandType = CommandType.TakeItem;
            if (tokens.length >= 2) {
                com.args.push(this.GetThing(tokens.slice(1, tokens.length)));
            }
        } else if (this.StartsWith(tokens, "drop")) {
            com.commandType = CommandType.DropItem;
            if (tokens.length >= 2) {
                com.args.push(this.GetThing(tokens.slice(1, tokens.length)));
            }
        } else if (this.StartsWith(tokens, "open")) {
            com.commandType = CommandType.Open;
            if (tokens.length >= 2) {
                com.args.push(this.GetThing(tokens.slice(1, tokens.length)));
            }
        } else if (this.StartsWith(tokens, "close")) {
            com.commandType = CommandType.Close;
            if (tokens.length >= 2) {
                com.args.push(this.GetThing(tokens.slice(1, tokens.length)));
            }
        } else if (this.StartsWith(tokens, "talk", "to")) {
            com.commandType = CommandType.TalkTo;
            if (tokens.length >= 3) {
                com.args.push(this.GetThing(tokens.slice(2, tokens.length)));
            }
        } else if (!isNaN(parseInt(tokens[0]))) {
            com.commandType = CommandType.DialogOption;
            com.args = tokens;
        } else if (this.StartsWith(tokens, "help")) {
            com.commandType = CommandType.Help;
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

    private GetThing(args: string[]): string {
        // Remove articles from the name
        if (this.StartsWith(args, "the") || this.StartsWith(args, "a") || this.StartsWith(args, "an")) {
            args = args.slice(1, args.length);
        }
        return args.join(" ");
    }
}
