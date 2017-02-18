import { IParser, Command, CommandType } from "./IParser";

export class DummParser implements IParser {
    Parse(commandString: string): Command {
        let com = new Command();
        com.command = commandString.toLowerCase();
        let tokens = com.command.split(/\s+/);

        if (tokens.length == 0) {
            return null;
        } else if (tokens[0] == "look" && tokens[1] == "at") {
            com.commandType = CommandType.LookAt;
            if (tokens.length >= 3) {
                com.args.push(tokens.slice(2, tokens.length).join(" "));
            }
        } else if (tokens[0] == "look") {
            com.commandType = CommandType.LookAround;
        } else {
            com.commandType = CommandType.Custom;
            com.args = tokens;
        }
        
        return com;
    }
}