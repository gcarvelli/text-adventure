import { Player, RoomMap } from "./Models/Models";
import { Command, CommandType, IParser } from "./Parse/IParser";
import { Config } from "./Models/Config";

export interface Output {
    Print(output: string);
    Clear();
}

export class Engine {
    out: Output;
    config: Config;
    parser: IParser;

    private PrintHeader() {
        this.out.Print("House Explorer");
        this.out.Print("Version 0.1.0");
        this.out.Print("");
    }

    public Initialize(data: any, out: Output, parser: IParser) {
        this.out = out;
        this.parser = parser;

        // Load in all rooms
        this.config = new Config(data);

        this.out.Clear();
        this.PrintHeader();
        this.out.Print(this.config.player.location.description);
    }

    public Execute(commandString: string) {
        this.Apply(this.parser.Parse(commandString));
    }

    public Apply(command: Command) {
        switch (command.commandType) {
            case CommandType.LookAround:
                this.out.Clear();
                this.PrintHeader();
                this.out.Print(this.config.player.location.description);
                break;
            case CommandType.LookAt:
                if (command.args.length == 0) {
                    this.out.Print("Look at what?");
                } else {
                    // look at something
                    this.out.Print("Maybe someday...");
                }
                break;
            case CommandType.Unknown:
                this.out.Print("Sorry, I didn't understand that.");
                break;
            default:
                this.out.Print("Well shucks, looks like I can't do that yet.");
                break;
        }
    }
}